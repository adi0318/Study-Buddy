document.addEventListener('DOMContentLoaded', function() {

    const buddyForm = document.getElementById('buddy-form');
    const buddyClearBtn = document.getElementById('buddy-clear');
    const matchingList = document.getElementById('matching-list');
    const profileForm = document.getElementById('profile-form');
    const queryForm = document.getElementById('query-form');
    const queryList = document.getElementById('queries-list');
    const clearQueryBtn = document.getElementById('clear-query-form');
    const categoryFilter = document.getElementById('filter-q-category');


    if (buddyForm) {
        buddyForm.addEventListener('submit', async function(e) {
            e.preventDefault();

           
            const name = document.getElementById('b-name').value.trim();
            const checkboxes = document.querySelectorAll('#buddy-form input[name="subjects"]:checked');
            const subjects = Array.from(checkboxes).map(cb => cb.value);

            
            if (!name || subjects.length === 0) {
                alert('Please enter your name and select at least one subject.');
                return;
            }

            try {
                
                const createResponse = await fetch('http://localhost:3000/api/buddies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, subjects })
                });

                if (!createResponse.ok) {
                    throw new Error('Failed to create/update buddy profile');
                }

                const createData = await createResponse.json();
                console.log('Profile created/updated:', createData);
                alert(`Profile for ${name} saved! Now finding matches...`);


                
                const matchResponse = await fetch('http://localhost:3000/api/buddies/match', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subjects })
                });

                if (!matchResponse.ok) {
                    throw new Error('Failed to find matches');
                }

                const matchData = await matchResponse.json();
                displayMatches(matchData.matches, name);

            } catch (error) {
                console.error('Error during Find Buddy process:', error);
                alert('An error occurred: ' + error.message);
            }
        });

        
        buddyClearBtn.addEventListener('click', function() {
            buddyForm.reset();
            if(matchingList) matchingList.innerHTML = '';
        });
    }

    
    function displayMatches(matches, currentUserName) {
        if (!matchingList) return;
        matchingList.innerHTML = '';

        if (matches.length === 0) {
            matchingList.innerHTML = '<li>No matching buddies found yet.</li>';
            return;
        }

        
        const otherBuddies = matches.filter(buddy => buddy.name.trim() !== currentUserName.trim());

        if (otherBuddies.length === 0) {
            matchingList.innerHTML = '<li>You are the first one with these subjects!</li>';
            return;
        }

        otherBuddies.forEach(buddy => {
            const li = document.createElement('li');
            li.className = 'match-item';
            li.innerHTML = `
                <strong>${buddy.name}</strong><br>
                Subjects: ${buddy.subjects.join(', ')}<br>
                <small>Added: ${new Date(buddy.createdAt).toLocaleString()}</small>
            `;
            matchingList.appendChild(li);
        });
    }

    
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('p-name').value.trim();
            const year = document.getElementById('p-year').value;
            
            
            const allCheckboxes = profileForm.querySelectorAll('input[type="checkbox"]:checked');
            const subjects = Array.from(allCheckboxes).map(cb => cb.value);

            
            if (!name || subjects.length === 0) {
                alert('Please enter your name and select at least one subject/interest.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/buddies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, year, subjects })
                });

                if (!response.ok) {
                    throw new Error('Failed to save profile on the server.');
                }

                alert('Profile saved successfully!');
                profileForm.reset();
                
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('An error occurred while saving the profile: ' + error.message);
            }
        });

        document.getElementById('clear-form').addEventListener('click', function() {
            profileForm.reset();
        });
        
        
    }



    async function postAnswer(e) {
        e.preventDefault();

        const form = e.target;
        const queryId = form.dataset.queryId; 

        const name = form.querySelector('.answer-name').value.trim();
        const body = form.querySelector('.answer-body').value.trim();

        if (!name || !body) {
            alert('Please enter your name and the answer text.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/queries/${queryId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, body })
            });

            if (!response.ok) {
                throw new Error('Failed to post answer.');
            }

            form.reset();
            loadAllQueries(); 
            
        } catch (error) {
            console.error('Error posting answer:', error);
            alert('An error occurred while posting the answer: ' + error.message);
        }
    }


    
    async function loadAllQueries() {
        if (!queryList) return;
        
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        let apiUrl = 'http://localhost:3000/api/queries';

        
        if (selectedCategory) {
            apiUrl += `?category=${selectedCategory}`;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch queries.');
            }
            
            const queries = await response.json();
            queryList.innerHTML = ''; // Clear existing list
            
            if (queries.length === 0) {
                queryList.innerHTML = `<p>${selectedCategory ? `No queries found for category: ${selectedCategory}.` : 'No queries found. Be the first to post one!'}</p>`;
                return;
            }

            for (const query of queries) {
                
                const answersResponse = await fetch(`http://localhost:3000/api/queries/${query._id}/answers`);
                const answers = answersResponse.ok ? await answersResponse.json() : [];

                
                const answersHtml = answers.map(answer => `
                    <div class="answer">
                        <p>${answer.body}</p>
                        <div class="query-meta">Answered by <strong>${answer.name}</strong> on ${new Date(answer.createdAt).toLocaleDateString()}</div>
                    </div>
                `).join('');

                const card = document.createElement('div');
                card.className = 'query-item';
                card.innerHTML = `
                    <div class="query-head">
                        <h4 class="query-title">${query.title}</h4>
                        <span class="badge">${query.category}</span>
                    </div>
                    <p>${query.body}</p>
                    <div class="query-meta">
                        Posted by <strong>${query.name}</strong> (Year ${query.year || 'N/A'}) on 
                        ${new Date(query.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div class="answer-stack">
                        <h5 style="margin-top: 0.5rem;">Responses (${answers.length})</h5>
                        ${answersHtml}

                        <form class="answer-form" data-query-id="${query._id}">
                            <input type="text" class="answer-name" placeholder="Your Name" required style="margin-bottom: 0.4rem;"/>
                            <textarea class="answer-body" rows="2" placeholder="Post your answer..." required></textarea>
                            <button type="submit" class="btn-primary" style="padding: 0.4rem 0.6rem; margin-top: 0.4rem; font-size: 0.85rem;">Post Answer</button>
                        </form>
                    </div>
                `;
                queryList.appendChild(card);

                
                const newAnswerForm = card.querySelector('.answer-form');
                if (newAnswerForm) {
                    newAnswerForm.addEventListener('submit', postAnswer);
                }
            }


        } catch (error) {
            console.error('Error loading queries:', error);
            queryList.innerHTML = `<p style="color:red;">Error loading queries: ${error.message}</p>`;
        }
    }


    if (queryForm) {
        queryForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            
            const name = document.getElementById('q-name').value.trim();
            const year = document.getElementById('q-year').value;
            const category = document.getElementById('q-category').value;
            const title = document.getElementById('q-title').value.trim();
            const body = document.getElementById('q-body').value.trim();

            
            if (!name || !category || !title || !body) {
                alert('Please fill in your Name, Category, Title, and Description.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/queries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, year, category, title, body })
                });

                if (!response.ok) {
                    throw new Error('Failed to post query on the server.');
                }

                alert('Query posted successfully!');
                queryForm.reset();
                loadAllQueries(); 
                
            } catch (error) {
                console.error('Error posting query:', error);
                alert('An error occurred while posting the query: ' + error.message);
            }
        });

        clearQueryBtn.addEventListener('click', function() {
            queryForm.reset();
        });

        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', loadAllQueries);
        }

        
        loadAllQueries();
    }
});