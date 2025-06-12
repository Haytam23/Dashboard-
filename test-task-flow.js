// Quick test to verify backend task creation and fetching
const API_URL = 'https://dashboard-backend-nine-phi.vercel.app';

async function testProjectTaskFlow() {
    console.log('🔍 Testing Project-Task flow...');
    
    try {
        // Step 1: Login
        console.log('1. Logging in...');        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: 'admin@dashboard.com',
                password: 'H2@@3/**/'
            }),
        });
        
        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status}`);
        }
        
        const loginData = await loginRes.json();
        console.log('✅ Login successful');
        
        // Step 2: Create a project with tasks
        console.log('2. Creating project with tasks...');
        const projectData = {
            name: 'Task Verification Project',
            description: 'Testing task creation and retrieval',
            startDate: '2025-06-13',
            endDate: '2025-08-13',
            category: 'Testing',
            priority: 'high',
            tasks: [
                {
                    name: 'Test Task 1',
                    description: 'First test task',
                    assignee: 'Test User 1',
                    dueDate: '2025-07-01',
                    priority: 'medium'
                },
                {
                    name: 'Test Task 2',
                    description: 'Second test task',
                    assignee: 'Test User 2',
                    dueDate: '2025-07-15',
                    priority: 'high'
                }
            ]
        };
          const projectRes = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            credentials: 'include',
            body: JSON.stringify(projectData),
        });
        
        if (!projectRes.ok) {
            throw new Error(`Project creation failed: ${projectRes.status}`);
        }
        
        const project = await projectRes.json();
        console.log('✅ Project created:', project);
          // Step 3: Fetch tasks for the project
        console.log('3. Fetching tasks for project...');
        const tasksRes = await fetch(`${API_URL}/projects/${project.id}/tasks`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            },
            credentials: 'include'
        });
        
        if (!tasksRes.ok) {
            throw new Error(`Task fetching failed: ${tasksRes.status}`);
        }
        
        const tasks = await tasksRes.json();
        console.log('✅ Tasks fetched:', tasks);
        
        // Step 4: Analyze results
        console.log('📊 Analysis:');
        console.log(`   - Project ID: ${project.id}`);
        console.log(`   - Tasks count: ${tasks.length}`);
        console.log(`   - Expected: 2 tasks`);
        
        if (tasks.length === 0) {
            console.error('❌ NO TASKS FOUND! This is the bug!');
            return false;
        } else if (tasks.length === 2) {
            console.log('✅ Correct number of tasks found');
            return true;
        } else {
            console.warn(`⚠️ Unexpected task count: ${tasks.length}`);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
}

// Run the test
testProjectTaskFlow().then(success => {
    console.log(success ? '✅ Test PASSED' : '❌ Test FAILED');
});
