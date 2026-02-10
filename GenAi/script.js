// DOM Elements
const startBtn = document.getElementById('startBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const reportText = document.getElementById('reportText');
const analyzeBtn = document.getElementById('analyzeBtn');
const processingSection = document.getElementById('processingSection');
const resultSection = document.getElementById('resultSection');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const copyResult = document.getElementById('copyResult');
const printResult = document.getElementById('printResult');
const contactForm = document.getElementById('contactForm');

// Auth elements
const authLink = document.getElementById('authLink');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const signInTab = document.getElementById('signInTab');
const signUpTab = document.getElementById('signUpTab');
const authForm = document.getElementById('authForm');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const nameGroup = document.getElementById('nameGroup');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authModalTitle = document.getElementById('authModalTitle');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const authNav = document.getElementById('authNav');

// Profile elements
const profileLink = document.getElementById('profileLink');
const profileNav = document.getElementById('profileNav');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const userFullName = document.getElementById('userFullName');
const userEmail = document.getElementById('userEmail');
const reportsList = document.getElementById('reportsList');
const logoutBtn = document.getElementById('logoutBtn');

// Logout elements
const logoutNav = document.getElementById('logoutNav');
const logoutLink = document.getElementById('logoutLink');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing event listeners');
    
    // Check if elements exist
    console.log('uploadBox:', uploadBox);
    console.log('fileInput:', fileInput);
    console.log('reportText:', reportText);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Start button functionality
    startBtn.addEventListener('click', function() {
        if (checkUserAuthentication()) {
            document.getElementById('app').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });

    // Learn More button functionality
    learnMoreBtn.addEventListener('click', function() {
        document.getElementById('about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Upload box functionality
    uploadBox.addEventListener('click', () => fileInput.click());
    uploadBox.addEventListener('dragenter', handleDragEnter);
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeReport);

    // Copy result button
    copyResult.addEventListener('click', copyResultToClipboard);

    // Print result button
    printResult.addEventListener('click', printResult);

    // Contact form submission
    contactForm.addEventListener('submit', handleContactForm);

    // Auth functionality
    authLink.addEventListener('click', function(e) {
        e.preventDefault();
        openAuthModal('signin');
    });

    closeAuthModal.addEventListener('click', closeAuthModalFunc);

    signInTab.addEventListener('click', function() {
        showSignInForm();
    });

    signUpTab.addEventListener('click', function() {
        showSignUpForm();
    });

    authForm.addEventListener('submit', handleAuthSubmit);

    forgotPasswordBtn.addEventListener('click', handleForgotPassword);

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            closeAuthModalFunc();
        }
    });
    
    // Profile functionality
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        openProfileModal();
    });
    
    closeProfileModal.addEventListener('click', closeProfileModalFunc);
    
    logoutBtn.addEventListener('click', handleLogout);
    
    // Logout functionality
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
    
    // Close profile modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === profileModal) {
            closeProfileModalFunc();
        }
    });


});

// Drag and drop functionality
let dragCounter = 0;

function handleDragOver(e) {
    console.log('Drag over event');
    e.preventDefault();
}

function handleDragEnter(e) {
    console.log('Drag enter event');
    e.preventDefault();
    dragCounter++;
    if (uploadBox) {
        uploadBox.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    console.log('Drag leave event');
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0 && uploadBox) {
        uploadBox.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    console.log('Drop event');
    e.preventDefault();
    dragCounter = 0;
    if (uploadBox) {
        uploadBox.classList.remove('drag-over');
    }
    
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    if (files.length) {
        processFile(files[0]);
    }
}

// File selection handler
function handleFileSelect(e) {
    console.log('File input changed:', e.target.files);
    const file = e.target.files[0];
    if (file) {
        console.log('Processing file:', file.name, file.type, file.size);
        processFile(file);
    } else {
        console.log('No file selected');
    }
}

// Process uploaded file
async function processFile(file) {
    console.log('processFile called with:', file);

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

    console.log('File type:', file.type);
    console.log('Allowed types:', allowedTypes);
    console.log('Type check result:', allowedTypes.includes(file.type));

    if (!allowedTypes.includes(file.type)) {
        console.log('File type not allowed');
        showToast('Please upload a valid PDF, Word, or text document', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File size should be less than 10MB', 'error');
        return;
    }

    try {
        let extractedText = '';

        if (file.type === 'application/pdf') {
            console.log('Processing PDF file');
            extractedText = await extractTextFromPDF(file);
        } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            console.log('Processing Word file');
            extractedText = await extractTextFromWord(file);
        } else if (file.type === 'text/plain') {
            console.log('Processing text file');
            extractedText = await extractTextFromText(file);
        }

        console.log('Extracted text length:', extractedText.length);
        console.log('First 200 characters:', extractedText.substring(0, 200));

        if (extractedText.trim().length === 0) {
            showToast('Could not extract text from the document. Please ensure it contains readable text.', 'error');
            return;
        }

        // Store the extracted text and file name for analysis
        window.extractedReportText = extractedText;
        window.uploadedFileName = file.name;

        // Update upload box to show file was processed
        uploadBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                <div style="flex: 1;">
                    <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                    <p>Document processed successfully!</p>
                    <p class="small-text" style="font-size: 12px; color: #666; margin: 5px 0;">File: ${file.name}</p>
                    <p class="small-text">Click "Analyze Report" to get insights</p>
                </div>
                <button id="cancelUploadBtn" style="background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        uploadBox.classList.add('file-uploaded');

        // Add cancel button functionality
        document.getElementById('cancelUploadBtn').addEventListener('click', function() {
            // Reset upload box
            uploadBox.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop your medical report here</p>
                <p class="small-text">or click to browse files</p>
                <p class="small-text">Supported formats: PDF, Word, Text</p>
            `;
            uploadBox.classList.remove('file-uploaded');

            // Clear stored data
            window.extractedReportText = null;
            window.uploadedFileName = null;

            // Reset file input
            fileInput.value = '';

            showToast('Upload cancelled', 'info');
        });

        showToast('Document processed successfully! Click "Analyze Report" to get insights.');

    } catch (error) {
        console.error('File processing error:', error);
        showToast('Error processing file. Please try again.', 'error');
    }
}

// Extract text from PDF file
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = async function() {
            try {
                const typedArray = new Uint8Array(this.result);

                // Load PDF document
                const pdf = await pdfjsLib.getDocument({data: typedArray}).promise;

                let fullText = '';

                // Extract text from each page
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }

                resolve(fullText);
            } catch (error) {
                console.error('PDF extraction error:', error);
                reject(error);
            }
        };

        fileReader.onerror = () => reject(new Error('Failed to read file'));
        fileReader.readAsArrayBuffer(file);
    });
}

// Extract text from Word file
async function extractTextFromWord(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = async function() {
            try {
                const arrayBuffer = this.result;

                // Use Mammoth.js to extract text from Word document
                const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
                resolve(result.value);

            } catch (error) {
                console.error('Word extraction error:', error);
                reject(error);
            }
        };

        fileReader.onerror = () => reject(new Error('Failed to read file'));
        fileReader.readAsArrayBuffer(file);
    });
}

// Extract text from plain text file
async function extractTextFromText(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = function() {
            try {
                resolve(this.result);
            } catch (error) {
                console.error('Text extraction error:', error);
                reject(error);
            }
        };

        fileReader.onerror = () => reject(new Error('Failed to read file'));
        fileReader.readAsText(file);
    });
}

// Check if user is logged in before allowing report analysis
function checkUserAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast('Please sign in to access medical report analysis features', 'error');
        openAuthModal('signin');
        return false;
    }
    return true;
}

// Analyze report function
async function analyzeReport() {
    // Check authentication first
    if (!checkUserAuthentication()) {
        return;
    }

    // Use extracted text from uploaded document
    const textContent = window.extractedReportText || '';

    if (!textContent) {
        showToast('Please upload a PDF or Word document first', 'error');
        return;
    }

    // Show processing section
    processingSection.style.display = 'block';
    resultSection.style.display = 'none';
    
    // Scroll to processing section
    processingSection.scrollIntoView({ behavior: 'smooth' });
    
    // Simulate processing steps
    const steps = document.querySelectorAll('.processing-step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            steps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
        }, index * 1000);
    });

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Generate sample analysis (in real implementation, this would call your backend API)
        const analysis = generateSampleAnalysis(textContent);
        
        // Display results
        displayResults(analysis);
        
        // Hide processing, show results
        processingSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        showToast('Analysis completed successfully!');
        
    } catch (error) {
        console.error('Analysis error:', error);
        showToast('Error analyzing report. Please try again.', 'error');
        processingSection.style.display = 'none';
    }
    
    // Save report to user account if user is logged in
    const analysis = generateSampleAnalysis(textContent);
    saveReportToAccount(textContent, analysis);
}

// Generate sample analysis (this would be replaced with actual AI processing)
function generateSampleAnalysis(textContent) {
    // Extract key health indicators and patient info from the report text
    const { indicators: healthIndicators, patientInfo } = extractHealthIndicators(textContent);

    // Generate personalized summary based on extracted data and patient info
    let summary = "";
    if (patientInfo.name) {
        summary += `${patientInfo.name}'s medical report shows various health parameters. `;
    } else {
        summary += "This medical report shows various health parameters. ";
    }

    const abnormalCount = healthIndicators.filter(h => h.status !== 'normal').length;
    if (abnormalCount > 0) {
        summary += `The analysis indicates ${abnormalCount} value(s) that require attention and follow-up with your healthcare provider.`;
    } else {
        summary += "All values appear to be within normal ranges.";
    }

    // Add age and gender specific insights
    if (patientInfo.age) {
        if (patientInfo.age > 50) {
            summary += ` Given the patient's age of ${patientInfo.age}, regular monitoring is particularly important.`;
        } else if (patientInfo.age < 30) {
            summary += ` At ${patientInfo.age} years old, maintaining these healthy parameters sets a strong foundation for long-term wellness.`;
        }
    }

    if (patientInfo.gender) {
        const gender = patientInfo.gender.toLowerCase();
        if (gender === 'female' || gender === 'f') {
            summary += " Women's health considerations have been taken into account in this analysis.";
        } else if (gender === 'male' || gender === 'm') {
            summary += " Men's health considerations have been taken into account in this analysis.";
        }
    }

    // Generate explanations based on found terms
    const explanations = [];
    const foundTerms = new Set(healthIndicators.map(h => h.category));

    if (foundTerms.has('glucose') || foundTerms.has('blood glucose')) {
        explanations.push({
            term: "Blood Glucose",
            explanation: "This measures the amount of sugar (glucose) in your blood. High levels may indicate diabetes or prediabetes."
        });
    }
    if (foundTerms.has('cholesterol') || foundTerms.has('lipid')) {
        explanations.push({
            term: "Cholesterol",
            explanation: "This is a waxy substance found in your blood. High levels can increase risk of heart disease."
        });
    }
    if (foundTerms.has('hemoglobin') || foundTerms.has('blood count')) {
        explanations.push({
            term: "Hemoglobin",
            explanation: "This protein in red blood cells carries oxygen throughout your body. Low levels may indicate anemia."
        });
    }
    if (foundTerms.has('kidney') || foundTerms.has('creatinine') || foundTerms.has('bun')) {
        explanations.push({
            term: "Kidney Function",
            explanation: "Tests that measure how well your kidneys are filtering waste from your blood."
        });
    }

    // Generate personalized questions based on abnormal values and patient info
    const questions = [];
    const abnormalIndicators = healthIndicators.filter(h => h.status !== 'normal');

    abnormalIndicators.forEach(indicator => {
        if (indicator.category.includes('glucose')) {
            if (patientInfo.age && patientInfo.age > 40) {
                questions.push("Given your age, what specific lifestyle changes do you recommend to manage blood sugar levels and prevent diabetes complications?");
            } else {
                questions.push("What lifestyle changes do you recommend to improve my blood sugar levels?");
            }
        }
        if (indicator.category.includes('cholesterol')) {
            if (patientInfo.gender && (patientInfo.gender.toLowerCase() === 'male' || patientInfo.gender.toLowerCase() === 'm')) {
                questions.push("As a male patient, should I be particularly concerned about my cholesterol levels and cardiovascular risk?");
            } else {
                questions.push("Should I be concerned about my cholesterol levels and what are my treatment options?");
            }
        }
        if (indicator.category.includes('hemoglobin')) {
            if (patientInfo.gender && (patientInfo.gender.toLowerCase() === 'female' || patientInfo.gender.toLowerCase() === 'f')) {
                questions.push("As a female patient, what could be causing my low hemoglobin and how does this relate to menstrual health?");
            } else {
                questions.push("What could be causing my low hemoglobin and how can it be treated?");
            }
        }
        if (indicator.category.includes('kidney') || indicator.category.includes('creatinine')) {
            if (patientInfo.age && patientInfo.age > 60) {
                questions.push("At my age, how can I improve my kidney function and what monitoring schedule do you recommend?");
            } else {
                questions.push("How can I improve my kidney function?");
            }
        }
    });

    // Add personalized general questions
    if (abnormalIndicators.length > 0) {
        if (patientInfo.age) {
            questions.push(`How often should I get these tests done for monitoring given my age of ${patientInfo.age}?`);
        } else {
            questions.push("How often should I get these tests done for monitoring?");
        }
        questions.push("Are there any symptoms I should watch out for related to these results?");
    }

    // Add patient-specific questions
    if (patientInfo.age && patientInfo.age > 50) {
        questions.push("What preventive screenings or additional tests would you recommend given my age?");
    }

    if (patientInfo.gender && (patientInfo.gender.toLowerCase() === 'female' || patientInfo.gender.toLowerCase() === 'f')) {
        questions.push("Are there any gender-specific health considerations I should be aware of based on these results?");
    }

    const analysis = {
        summary: summary,
        abnormalValues: abnormalIndicators,
        explanations: explanations,
        questions: questions,
        nutrition: generateNutritionRecommendations(healthIndicators),
        patientInfo: patientInfo // Include patient info in analysis
    };

    return analysis;
}

// Save report to user account
function saveReportToAccount(originalText, analysis) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const reportId = Date.now();
        const report = {
            id: reportId,
            originalText: originalText.substring(0, 100) + '...', // Store truncated version
            analysis: analysis,
            date: new Date().toISOString(),
            title: `Report ${new Date().toLocaleDateString()}`
        };
        
        // Load existing reports and add new one
        const user = {...currentUser};
        if (!user.reports) {
            user.reports = [];
        }
        user.reports.unshift(report); // Add to beginning of array
        
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Display analysis results
function displayResults(analysis) {
    // Display summary
    document.getElementById('summaryContent').innerHTML = `
        <p>${analysis.summary}</p>
    `;

    // Display all health indicators, not just abnormal ones
    const abnormalContent = document.getElementById('abnormalContent');
    abnormalContent.innerHTML = '';

    // Get all health indicators from the extraction
    const { indicators: allIndicators } = extractHealthIndicators(window.extractedReportText || '');

    allIndicators.forEach(item => {
        const valueClass = item.status === 'high' || item.status === 'low' ? 'abnormal-value' : 'normal-value';
        const statusText = item.status === 'high' ? 'Above Normal' : item.status === 'low' ? 'Below Normal' : 'Normal';

        abnormalContent.innerHTML += `
            <div class="abnormal-item">
                <strong>${item.name}:</strong>
                <span class="${valueClass}">${item.value}</span>
                <span>(${item.normalRange}) - ${statusText}</span>
            </div>
        `;
    });

    // Display term explanations
    const explanationContent = document.getElementById('explanationContent');
    explanationContent.innerHTML = '';

    analysis.explanations.forEach(item => {
        explanationContent.innerHTML += `
            <div class="explanation-item">
                <h4>${item.term}</h4>
                <p>${item.explanation}</p>
            </div>
        `;
    });

    // Display doctor questions
    const questionsContent = document.getElementById('questionsContent');
    questionsContent.innerHTML = '<ul>';

    analysis.questions.forEach(question => {
        questionsContent.innerHTML += `<li>${question}</li>`;
    });

    questionsContent.innerHTML += '</ul>';
}

// Copy result to clipboard
function copyResultToClipboard() {
    const resultContent = document.querySelector('.result-content').innerText;
    
    navigator.clipboard.writeText(resultContent).then(() => {
        showToast('Results copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy results', 'error');
    });
}

// Print result
function printAnalysisResult() {
    const printContent = document.querySelector('.result-section').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <html>
            <head>
                <title>Medical Report Analysis</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .result-section { max-width: 800px; margin: 0 auto; }
                    .result-header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                    .result-content > div { margin-bottom: 20px; padding: 15px; background: #f9f9f9; }
                    h3 { color: #1a237e; }
                    .abnormal-value { background: #ffebee; color: #c62828; padding: 2px 6px; }
                    .normal-value { background: #e8f5e8; color: #2e7d32; padding: 2px 6px; }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    // In real implementation, send to backend
    console.log('Contact form submitted:', { name, email, message });
    
    showToast('Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
}

// Authentication Functions

function openAuthModal(mode = 'signin') {
    if (mode === 'signup') {
        showSignUpForm();
    } else {
        showSignInForm();
    }
    authModal.style.display = 'block';
}

function closeAuthModalFunc() {
    authModal.style.display = 'none';
}

function showSignInForm() {
    signInTab.classList.add('active');
    signUpTab.classList.remove('active');
    confirmPasswordGroup.style.display = 'none';
    nameGroup.style.display = 'none';
    authSubmitBtn.textContent = 'Sign In';
    authModalTitle.textContent = 'Sign In';
    forgotPasswordBtn.style.display = 'inline';
    authForm.setAttribute('data-mode', 'signin');
}

function showSignUpForm() {
    signUpTab.classList.add('active');
    signInTab.classList.remove('active');
    confirmPasswordGroup.style.display = 'block';
    nameGroup.style.display = 'block';
    authSubmitBtn.textContent = 'Sign Up';
    authModalTitle.textContent = 'Sign Up';
    forgotPasswordBtn.style.display = 'none';
    authForm.setAttribute('data-mode', 'signup');
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const mode = authForm.getAttribute('data-mode');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (mode === 'signup') {
        const confirmPassword = document.getElementById('confirmPassword').value;
        const fullName = document.getElementById('fullName').value;
        
        // Validation
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        // In a real app, you would send this to your backend
        // For now, we'll simulate successful signup
        registerUser(email, password, fullName);
    } else {
        // Sign in
        authenticateUser(email, password);
    }
}

function registerUser(email, password, fullName) {
    // Simulate API call to register user
    setTimeout(() => {
        // Store user info in localStorage (in a real app, this would be a session)
        const user = {
            id: Date.now(), // In a real app, this would come from the server
            email,
            fullName,
            createdAt: new Date().toISOString(),
            reports: [] // Initialize empty reports array
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('hasRegistered', 'true');
        updateAuthUI(true, fullName);
        closeAuthModalFunc();
        showToast('Registration successful! Welcome to MediSimplify AI.');
    }, 1000);
}

function authenticateUser(email, password) {
    // In a real app, you would send credentials to your backend
    // For now, we'll check against localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (storedUser && storedUser.email === email) {
        // In a real app, you would verify the password
        updateAuthUI(true, storedUser.fullName);
        closeAuthModalFunc();
        showToast('Welcome back! You are now signed in.');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleForgotPassword() {
    const email = prompt('Please enter your email address:');
    if (email) {
        // In a real app, you would send a reset link to the email
        showToast('Password reset instructions sent to your email.');
    }
}

function updateAuthUI(isLoggedIn, userName = '') {
    if (isLoggedIn) {
        authLink.textContent = userName || 'Account';
        authLink.href = '#';
        authNav.style.display = 'none';
        profileNav.style.display = 'block';
        logoutNav.style.display = 'block';
    } else {
        authLink.textContent = 'Sign In';
        authLink.href = '#';
        authNav.style.display = 'block';
        profileNav.style.display = 'none';
        logoutNav.style.display = 'none';
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    updateAuthUI(false);
    closeProfileModalFunc();
    
    // Hide main content and show registration requirement
    const hasRegistered = localStorage.getItem('hasRegistered');
    if (hasRegistered) {
        document.getElementById('registrationBanner').style.display = 'block';
        document.querySelector('.app-section').style.display = 'none';
        document.getElementById('features').style.display = 'none';
        document.getElementById('about').style.display = 'none';
        document.getElementById('how-it-works').style.display = 'none';
        document.getElementById('contact').style.display = 'none';
    } else {
        // First time visitor after logout - redirect to registration
        window.location.href = 'register.html';
    }
    
    showToast('You have been logged out successfully.');
}

function openProfileModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        userFullName.textContent = currentUser.fullName || currentUser.email;
        userEmail.textContent = currentUser.email;
        
        // Load user reports
        loadUserReports(currentUser);
        
        profileModal.style.display = 'block';
    }
}

function closeProfileModalFunc() {
    profileModal.style.display = 'none';
}

function loadUserReports(user) {
    if (user.reports && user.reports.length > 0) {
        reportsList.innerHTML = '';
        
        user.reports.forEach(report => {
            const reportElement = document.createElement('div');
            reportElement.className = 'report-item';
            
            const formattedDate = new Date(report.date).toLocaleString();
            
            reportElement.innerHTML = `
                <h5>${report.title}</h5>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Summary:</strong> ${report.originalText}</p>
                <button class="btn btn-small" onclick="loadReportDetails(${report.id})">View Details</button>
            `;
            
            reportsList.appendChild(reportElement);
        });
    } else {
        reportsList.innerHTML = '<p class="no-reports-message">No reports saved yet. Analyze your first medical report to get started.</p>';
    }
}

function loadReportDetails(reportId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.reports) {
        const report = currentUser.reports.find(r => r.id == reportId);
        if (report) {
            // Display the report analysis
            displayResults(report.analysis);
            
            // Show results section
            document.getElementById('processingSection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
            
            // Scroll to results
            document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
            
            // Close profile modal
            closeProfileModalFunc();
            
            showToast('Report loaded successfully!');
        }
    }
}

// Check registration requirement on page load
window.addEventListener('load', function() {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    const hasRegistered = localStorage.getItem('hasRegistered');
    
    if (storedUser) {
        // User is logged in
        updateAuthUI(true, storedUser.fullName);
        document.getElementById('registrationBanner').style.display = 'none';
        document.querySelector('.app-section').style.display = 'block';
    } else if (hasRegistered) {
        // User has registered but not logged in
        document.getElementById('registrationBanner').style.display = 'block';
        document.querySelector('.app-section').style.display = 'none';
        document.getElementById('features').style.display = 'none';
        document.getElementById('about').style.display = 'none';
        document.getElementById('how-it-works').style.display = 'none';
        document.getElementById('contact').style.display = 'none';
    } else {
        // First time visitor - redirect to registration
        window.location.href = 'register.html';
    }
});

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView();
            }
        });
    });
}

// Register page functionality
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const confirmPassword = document.getElementById('registerConfirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('registerFullName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPasswordValue = confirmPassword.value;
        const subscribeNewsletter = document.getElementById('subscribeNewsletter').checked;

        // Validation
        if (!fullName || !email || !password || !confirmPasswordValue) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        // Password validation
        if (password.length < 8) {
            showToast('Password must be at least 8 characters long', 'error');
            return;
        }

        // Password match validation
        if (password !== confirmPasswordValue) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Terms agreement validation
        if (!agreeTerms.checked) {
            showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }

        // Check if user already exists
        const existingUser = JSON.parse(localStorage.getItem('currentUser'));
        if (existingUser && existingUser.email === email) {
            showToast('An account with this email already exists', 'error');
            return;
        }

        // Simulate registration process
        showToast('Creating your account...', 'info');

        setTimeout(() => {
            const newUser = {
                id: Date.now(),
                fullName: fullName,
                email: email,
                createdAt: new Date().toISOString(),
                reports: [],
                newsletter: subscribeNewsletter
            };

            localStorage.setItem('currentUser', JSON.stringify(newUser));
            localStorage.setItem('hasRegistered', 'true');

            showToast('Account created successfully! Redirecting to main site...', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    });
}

// Social login buttons (placeholders)
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', function() {
        showToast('Google login integration coming soon!', 'info');
    });
});

document.querySelectorAll('.btn-facebook').forEach(btn => {
    btn.addEventListener('click', function() {
        showToast('Facebook login integration coming soon!', 'info');
    });
});

// Add scroll animation effects
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.feature-card, .step, .stat-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize animations
document.querySelectorAll('.feature-card, .step, .stat-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Extract health indicators and patient information from medical report text
function extractHealthIndicators(textContent) {
    const indicators = [];
    const patientInfo = {};
    const text = textContent.toLowerCase();

    console.log('Extracting health indicators and patient info from text:', text.substring(0, 500));

    // Extract patient information
    const namePatterns = [
        /patient name[^:]*:\s*([A-Za-z\s]+)/i,
        /name[^:]*:\s*([A-Za-z\s]+)/i,
        /patient[^:]*:\s*([A-Za-z\s]+)/i
    ];

    namePatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match && !patientInfo.name) {
            patientInfo.name = match[1].trim();
        }
    });

    const agePatterns = [
        /age[^:]*:\s*(\d+)/i,
        /years old[^:]*:\s*(\d+)/i
    ];

    agePatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match && !patientInfo.age) {
            patientInfo.age = parseInt(match[1]);
        }
    });

    const genderPatterns = [
        /gender[^:]*:\s*(male|female|m|f)/i,
        /sex[^:]*:\s*(male|female|m|f)/i
    ];

    genderPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match && !patientInfo.gender) {
            patientInfo.gender = match[1].toLowerCase();
        }
    });

    // Blood Glucose patterns - more flexible, don't require units
    const glucosePatterns = [
        /glucose[^:]*:\s*([\d.]+(?:\.\d+)?)/i,
        /blood glucose[^:]*:\s*([\d.]+(?:\.\d+)?)/i,
        /fasting.*glucose[^:]*:\s*([\d.]+(?:\.\d+)?)/i
    ];

    glucosePatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) {
            const value = parseFloat(match[1]);
            console.log('Found glucose:', value);
            indicators.push({
                name: "Blood Glucose",
                value: `${value} mg/dL`,
                normalRange: "70-100 mg/dL",
                status: value > 100 ? "high" : "normal",
                category: "glucose"
            });
        }
    });

    // Cholesterol patterns - more flexible, don't require units
    const cholesterolPatterns = [
        /cholesterol[^:]*:\s*([\d.]+(?:\.\d+)?)/i,
        /total cholesterol[^:]*:\s*([\d.]+(?:\.\d+)?)/i
    ];

    cholesterolPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) {
            const value = parseFloat(match[1]);
            console.log('Found cholesterol:', value);
            indicators.push({
                name: "Total Cholesterol",
                value: `${value} mg/dL`,
                normalRange: "<200 mg/dL",
                status: value >= 200 ? "high" : "normal",
                category: "cholesterol"
            });
        }
    });

    // Hemoglobin patterns - more flexible, don't require units
    const hemoglobinPatterns = [
        /hemoglobin[^:]*:\s*([\d.]+(?:\.\d+)?)/i,
        /hb[^:]*:\s*([\d.]+(?:\.\d+)?)/i
    ];

    hemoglobinPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) {
            const value = parseFloat(match[1]);
            console.log('Found hemoglobin:', value);
            indicators.push({
                name: "Hemoglobin",
                value: `${value} g/dL`,
                normalRange: "12-16 g/dL",
                status: value < 12 ? "low" : "normal",
                category: "hemoglobin"
            });
        }
    });

    // Creatinine patterns - more flexible, don't require units
    const creatininePatterns = [
        /creatinine[^:]*:\s*([\d.]+(?:\.\d+)?)/i
    ];

    creatininePatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) {
            const value = parseFloat(match[1]);
            console.log('Found creatinine:', value);
            indicators.push({
                name: "Creatinine",
                value: `${value} mg/dL`,
                normalRange: "0.7-1.3 mg/dL",
                status: value > 1.3 ? "high" : "normal",
                category: "kidney"
            });
        }
    });

    // BUN patterns - more flexible, don't require units
    const bunPatterns = [
        /blood urea nitrogen[^:]*:\s*([\d.]+(?:\.\d+)?)/i,
        /bun[^:]*:\s*([\d.]+(?:\.\d+)?)/i,
        /urea[^:]*:\s*([\d.]+(?:\.\d+)?)/i
    ];

    bunPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) {
            const value = parseFloat(match[1]);
            console.log('Found BUN:', value);
            indicators.push({
                name: "Blood Urea Nitrogen",
                value: `${value} mg/dL`,
                normalRange: "7-20 mg/dL",
                status: value > 20 ? "high" : "normal",
                category: "kidney"
            });
        }
    });

    console.log('Extracted indicators:', indicators);
    console.log('Extracted patient info:', patientInfo);

    // Return both indicators and patient info
    return { indicators, patientInfo };
}

// Generate nutrition recommendations based on health indicators
function generateNutritionRecommendations(healthIndicators) {
    const recommendations = [];

    // Check for high glucose
    const highGlucose = healthIndicators.find(h => h.category === 'glucose' && h.status === 'high');
    if (highGlucose) {
        recommendations.push({
            category: "Blood Sugar Management",
            tips: [
                "Limit refined carbohydrates and sugary foods",
                "Choose complex carbohydrates like whole grains, vegetables, and legumes",
                "Include lean proteins and healthy fats in each meal",
                "Monitor portion sizes and eat regular meals",
                "Stay hydrated with water and unsweetened beverages"
            ]
        });
    }

    // Check for high cholesterol
    const highCholesterol = healthIndicators.find(h => h.category === 'cholesterol' && h.status === 'high');
    if (highCholesterol) {
        recommendations.push({
            category: "Heart-Healthy Diet",
            tips: [
                "Reduce saturated fats from red meat and full-fat dairy",
                "Choose lean proteins like fish, poultry, and plant-based options",
                "Include heart-healthy fats from avocados, nuts, and olive oil",
                "Increase fiber intake with fruits, vegetables, and whole grains",
                "Limit processed foods and added sugars"
            ]
        });
    }

    // Check for low hemoglobin
    const lowHemoglobin = healthIndicators.find(h => h.category === 'hemoglobin' && h.status === 'low');
    if (lowHemoglobin) {
        recommendations.push({
            category: "Iron-Rich Foods",
            tips: [
                "Include iron-rich foods like lean red meat, poultry, and fish",
                "Eat plenty of leafy green vegetables (spinach, kale)",
                "Consume beans, lentils, and fortified cereals",
                "Pair iron-rich foods with vitamin C sources (citrus, bell peppers)",
                "Consider iron supplements only under medical supervision"
            ]
        });
    }

    // Check for kidney issues
    const kidneyIssues = healthIndicators.find(h => h.category === 'kidney' && h.status !== 'normal');
    if (kidneyIssues) {
        recommendations.push({
            category: "Kidney-Friendly Nutrition",
            tips: [
                "Limit sodium intake to less than 2,300 mg per day",
                "Stay well-hydrated with appropriate fluid intake",
                "Choose fresh fruits and vegetables over processed options",
                "Limit phosphorus-rich foods like dairy and nuts if advised",
                "Monitor potassium intake based on your specific needs"
            ]
        });
    }

    // General healthy eating tips
    recommendations.push({
        category: "General Healthy Eating",
        tips: [
            "Aim for a balanced plate with half vegetables/fruits, quarter protein, quarter whole grains",
            "Practice mindful eating and listen to your body's hunger cues",
            "Stay physically active to support overall health",
            "Consult with a registered dietitian for personalized nutrition advice",
            "Regular health check-ups are essential for monitoring progress"
        ]
    });

    return recommendations;
}
