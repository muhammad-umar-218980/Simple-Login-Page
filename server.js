const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const usersFile = 'users.txt';

const serverErrorResponse = `
  <script>
    alert('Server error');
    window.location.href = '/register.html';
  </script>
`;

const registrationFailedResponse = `
  <script>
    alert('Registration failed');
    window.location.href = '/register.html';
  </script>
`;

const getEmailInUseResponse = (registerPage) => {
	return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = 'Email already in use. Try a different one.';
        
        const emailContainer = document.querySelector('input[name="email"]').parentNode;
        emailContainer.parentNode.insertBefore(errorDiv, emailContainer.nextSibling);
      });
    </script>
    ${registerPage}
  `;
};

const getInvalidCredentialsResponse = (loginPage) => {
	return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = 'Invalid email or password.';
        
        const form = document.querySelector('form');
        form.insertBefore(errorDiv, form.firstChild);
      });
    </script>
    ${loginPage}
  `;
};

const getEmailNotFoundResponse = (loginPage) => {
	return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'email-error';
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = 'Email not found';
        
        const emailContainer = document.querySelector('input[name="email"]').parentNode;
        emailContainer.parentNode.insertBefore(errorDiv, emailContainer.nextSibling);
        
        const emailInput = document.querySelector('input[name="email"]');
        emailInput.addEventListener('input', function() {
          const error = document.getElementById('email-error');
          if (error) error.remove();
        });
      });
    </script>
    ${loginPage}
  `;
};

const getIncorrectPasswordResponse = (loginPage) => {
	return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = 'Incorrect password';
        
        const passwordContainer = document.querySelector('input[name="password"]').parentNode;
        passwordContainer.parentNode.insertBefore(errorDiv, passwordContainer.nextSibling);
      });
    </script>
    ${loginPage}
  `;
};

app.get('/', (req, res) => {
	console.log(`Request received for: ${req.url}`);
	res.redirect('/login.html');
});

app.post('/register', (req, res) => {
	const { fullName, email, password } = req.body;

	fs.readFile(usersFile, 'utf8', (err, data) => {
		if (err) {
			if (err.code !== 'ENOENT') {
				return res.send(serverErrorResponse);
			}
		}

		if (data && data.includes(`Email: ${email}`)) {
			const registerPage = fs.readFileSync(path.join(__dirname, 'public', 'register.html'), 'utf8');
			return res.send(getEmailInUseResponse(registerPage));
		}

		const newUser = `Full Name: ${fullName}\nEmail: ${email}\nPassword: ${password}\n\n`;

		fs.appendFile(usersFile, newUser, (err) => {
			if (err) {
				return res.send(registrationFailedResponse);
			} else {
				res.redirect('/login.html');
			}
		});
	});
});

app.post('/login', (req, res) => {
	const { email, password } = req.body;

	fs.readFile(usersFile, 'utf8', (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				const loginPage = fs.readFileSync(path.join(__dirname, 'public', 'login.html'), 'utf8');
				return res.send(getInvalidCredentialsResponse(loginPage));
			} else {
				return res.send('Server error');
			}
		}

		const userBlocks = data.trim().split('\n\n');
		let emailExists = false;
		let passwordCorrect = false;

		for (const block of userBlocks) {
			const lines = block.split('\n');
			if (lines[1] === `Email: ${email}`) {
				emailExists = true;
				if (lines[2] === `Password: ${password}`) {
					passwordCorrect = true;
				}
				break;
			}
		}

		if (!emailExists) {
			const loginPage = fs.readFileSync(path.join(__dirname, 'public', 'login.html'), 'utf8');
			return res.send(getEmailNotFoundResponse(loginPage));
		} else {
			if (!passwordCorrect) {
				const loginPage = fs.readFileSync(path.join(__dirname, 'public', 'login.html'), 'utf8');
				return res.send(getIncorrectPasswordResponse(loginPage));
			} else {
				res.send(`Login successful! Welcome back, ${email}`);
			}
		}
	});
});

app.post('/check-email', (req, res) => {
	const { email } = req.body;

	fs.readFile(usersFile, 'utf8', (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				return res.send('not found');
			} else {
				return res.status(500).send('Server error');
			}
		}

		const userBlocks = data.trim().split('\n\n');
		let emailExists = false;

		for (const block of userBlocks) {
			const lines = block.split('\n');
			if (lines[1] === `Email: ${email}`) {
				emailExists = true;
				break;
			}
		}

		if (emailExists) {
			res.send('exists');
		} else {
			res.send('not found');
		}
	});
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});