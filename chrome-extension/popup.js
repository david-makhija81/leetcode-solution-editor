document.addEventListener('DOMContentLoaded', () => {
  const importBtn = document.getElementById('import-btn');
  const statusDiv = document.getElementById('status');

  importBtn.addEventListener('click', async () => {
    try {
      importBtn.disabled = true;
      statusDiv.textContent = 'Importing...';
      statusDiv.className = '';

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('leetcode.com/problems/')) {
        throw new Error('Not a LeetCode problem page');
      }

      // Extract the titleSlug from the URL
      // Example: https://leetcode.com/problems/two-sum/description/ -> "two-sum"
      const url = new URL(tab.url);
      const pathParts = url.pathname.split('/').filter(p => p);
      
      const problemsIndex = pathParts.indexOf('problems');
      if (problemsIndex === -1 || problemsIndex === pathParts.length - 1) {
        throw new Error('Could not parse problem slug from URL');
      }
      
      const titleSlug = pathParts[problemsIndex + 1];

      // Send the slug to our local Next.js server
      const response = await fetch('http://localhost:3000/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titleSlug })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      statusDiv.textContent = 'Problem successfully imported!';
      statusDiv.className = 'success';
    } catch (error) {
      console.error(error);
      statusDiv.textContent = error.message || 'An error occurred';
      statusDiv.className = 'error';
    } finally {
      importBtn.disabled = false;
    }
  });
});
