// Player data storage
        let players = [];
        
        // DOM Elements
        const playerNameInput = document.getElementById('playerName');
        const playerLevelSelect = document.getElementById('playerLevel');
        const addPlayerBtn = document.getElementById('addPlayerBtn');
        const drawTeamsBtn = document.getElementById('drawTeamsBtn');
        const redoDrawBtn = document.getElementById('redoDrawBtn');
        const playersList = document.getElementById('playersList');
        const playersCount = document.getElementById('playersCount');
        const resultsSection = document.getElementById('resultsSection');
        const blueTeam = document.getElementById('blueTeam');
        const redTeam = document.getElementById('redTeam');
        const levelWeights = {
            'khaz': 6,
            'bom': 5,
            'da pra jogar': 4,
            'ruim': 3,
            'a natureza cuida': 2,
            'felps pnjoento': 1
        };

        // Add player function
        function addPlayer() {
            const name = playerNameInput.value.trim();
            const level = playerLevelSelect.value;

            if (!name) {
                alert('Bota um nome decente aí!');
                return;
            }

            if (!level) {
                alert('Seleciona o tier primeiro, sem migué.');
                return;
            }

            const alreadyExists = players.some(player => player.name.toLowerCase() === name.toLowerCase());
            if (alreadyExists) {
                alert('Esse ser humaninho já tá na lista.');
                return;
            }

            players.push({ name, level, weight: levelWeights[level] });
            updatePlayersList();
            playerNameInput.value = '';
            playerLevelSelect.selectedIndex = 0;
            playerNameInput.focus();
            
            // Enable draw button if we have enough players
            if (players.length >= 10) {
                drawTeamsBtn.disabled = false;
                drawTeamsBtn.classList.remove('pulse');
            }
        }
        
        // Update players list display
        function updatePlayersList() {
            playersCount.textContent = players.length;
            
            if (players.length === 0) {
                playersList.innerHTML = '<div class="text-gray-400 italic text-center py-4">Nenhum jogador adicionado ainda</div>';
                return;
            }
            
            playersList.innerHTML = '';
            players.forEach((player, index) => {
                const playerElement = document.createElement('div');
                playerElement.className = 'player-item bg-gray-700/50 p-3 rounded-lg flex justify-between items-center animate-fadeIn';
                playerElement.innerHTML = `
                    <span>${player.name} <span class="text-gray-300 text-sm">(${player.level})</span></span>
                    <button onclick="removePlayer(${index})" class="text-red-400 hover:text-red-300">&times;</button>
                `;
                playersList.appendChild(playerElement);
            });
        }
        
        // Remove player function
        function removePlayer(index) {
            players.splice(index, 1);
            updatePlayersList();
            
            // Disable draw button if we don't have enough players anymore
            if (players.length < 10) {
                drawTeamsBtn.disabled = true;
                drawTeamsBtn.classList.add('pulse');
            }
        }
        
        // Shuffle array function (Fisher-Yates algorithm)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        
        // Balanceia times considerando o level para evitar disparidade
        function balanceTeams(playerPool) {
            const shuffledPlayers = [...playerPool];
            shuffleArray(shuffledPlayers);
            const sortedByLevel = shuffledPlayers.sort((a, b) => b.weight - a.weight);

            const teamA = { members: [], total: 0 };
            const teamB = { members: [], total: 0 };

            sortedByLevel.forEach(player => {
                const pickTeamA = teamA.members.length < 5 && (teamA.total <= teamB.total || teamB.members.length === 5);
                const targetTeam = pickTeamA ? teamA : teamB;
                targetTeam.members.push(player);

                targetTeam.total += player.weight;
                
                
                console.log(`Adicionando ${player.name} (${player.level}) ao time ${pickTeamA ? 'A' : 'B'}. Totais: A=${teamA.total}, B=${teamB.total}`);

            });

            return [teamA.members, teamB.members];
        }
        
        // Draw teams function with improved logic
        function drawTeams() {

            console.log("Iniciando o sorteio dos times...");
            
            if (players.length < 10) {
                console.log("Tentativa de sortear times com menos de 10 jogadores.");
                alert("Você precisa adicionar pelo menos 10 jogadores para sortear os times!");
                return;
            }
            
            const [blueTeamPlayers, redTeamPlayers] = balanceTeams(players);
            
            // Display teams
            displayTeams(blueTeamPlayers, redTeamPlayers);
            
            // Show results section
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the first team member
            setTimeout(() => {
                const firstPlayer = blueTeam.querySelector('li');
                if (firstPlayer) {
                    firstPlayer.classList.add('highlight');
                }
            }, 500);
        }
        
        // Redo draw function - uses existing players
        function redoDraw() {
            if (players.length < 10) {
                alert("Você precisa adicionar pelo menos 10 jogadores para sortear os times!");
                return;
            }
            
            const [blueTeamPlayers, redTeamPlayers] = balanceTeams(players);
            
            // Display teams
            displayTeams(blueTeamPlayers, redTeamPlayers);
            
            // Highlight the first team member
            setTimeout(() => {
                const firstPlayer = blueTeam.querySelector('li');
                if (firstPlayer) {
                    firstPlayer.classList.add('highlight');
                }
            }, 500);
        }
        
        // Display teams in UI
        function displayTeams(bluePlayers, redPlayers) {
            // Clear existing content
            blueTeam.innerHTML = '';
            redTeam.innerHTML = '';
            
            // Add players to blue team
            bluePlayers.forEach(player => {
                const li = document.createElement('li');
                li.className = 'bg-blue-800/50 p-2 rounded flex items-center';
                li.textContent = `${player.name} (${player.level})`;
                blueTeam.appendChild(li);
            });
            
            // Add players to red team
            redPlayers.forEach(player => {
                const li = document.createElement('li');
                li.className = 'bg-red-800/50 p-2 rounded flex items-center';
                li.textContent = `${player.name} (${player.level})`;
                redTeam.appendChild(li);
            });
        }
        
        // Reset everything
        function reset() {
            players = [];
            updatePlayersList();
            resultsSection.classList.add('hidden');
            drawTeamsBtn.disabled = true;
            drawTeamsBtn.classList.add('pulse');
            playerNameInput.value = '';
            playerLevelSelect.selectedIndex = 0;
        }
        
        // Event Listeners
        addPlayerBtn.addEventListener('click', addPlayer);
        drawTeamsBtn.addEventListener('click', drawTeams);
        redoDrawBtn.addEventListener('click', redoDraw);
        
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addPlayer();
            }
        });

        playerLevelSelect.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addPlayer();
            }
        });
        
        // Initialize
        updatePlayersList();
        drawTeamsBtn.disabled = true;
        drawTeamsBtn.classList.add('pulse');