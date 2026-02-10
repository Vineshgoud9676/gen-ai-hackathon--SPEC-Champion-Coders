// Language Translation System
const translations = {
    en: {
        // UI Elements
        'startBtn': 'Start Simplifying',
        'learnMoreBtn': 'Learn More',
        'analyzeBtn': 'Analyze Report',
        'copyResult': 'Copy',
        'printResult': 'Print',
        'processingTitle': 'Analyzing your medical report...',
        'processingDesc': 'Our AI is processing your report to provide a simplified explanation',
        'resultTitle': 'Simplified Report Analysis',
        'summaryTitle': 'Summary',
        'abnormalTitle': 'Important Values',
        'explanationTitle': 'Medical Terms Explained',
        'questionsTitle': 'Questions for Your Doctor',
        'uploadText': 'Drag & Drop your medical report here',
        'uploadSubtext': 'or click to browse files',
        'pasteText': 'Paste your medical report text here...',
        'disclaimerTitle': 'Important Disclaimer',
        'disclaimerText': 'MediSimplify AI provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.'
    },
    hi: {
        // Hindi translations
        'startBtn': 'सरलीकरण शुरू करें',
        'learnMoreBtn': 'और जानें',
        'analyzeBtn': 'रिपोर्ट विश्लेषण करें',
        'copyResult': 'कॉपी करें',
        'printResult': 'प्रिंट करें',
        'processingTitle': 'आपकी मेडिकल रिपोर्ट का विश्लेषण किया जा रहा है...',
        'processingDesc': 'हमारा एआई आपकी रिपोर्ट को सरल व्याख्या प्रदान करने के लिए प्रसंस्करण कर रहा है',
        'resultTitle': 'सरलीकृत रिपोर्ट विश्लेषण',
        'summaryTitle': 'सारांश',
        'abnormalTitle': 'महत्वपूर्ण मान',
        'explanationTitle': 'चिकित्सा शब्दों की व्याख्या',
        'questionsTitle': 'आपके डॉक्टर के लिए प्रश्न',
        'uploadText': 'अपनी मेडिकल रिपोर्ट यहाँ ड्रैग एंड ड्रॉप करें',
        'uploadSubtext': 'या फ़ाइल ब्राउज़ करने के लिए क्लिक करें',
        'pasteText': 'अपनी मेडिकल रिपोर्ट का टेक्स्ट यहाँ पेस्ट करें...',
        'disclaimerTitle': 'महत्वपूर्ण अस्वीकरण',
        'disclaimerText': 'मेडीसिम्प्लिफाई एआई केवल शैक्षिक जानकारी प्रदान करता है और यह पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। चिकित्सा संबंधी चिंताओं के लिए हमेशा योग्य स्वास्थ्य देखभाल प्रदाताओं से परामर्श करें।'
    },
    te: {
        // Telugu translations
        'startBtn': 'సరళీకరణ ప్రారంభించండి',
        'learnMoreBtn': 'మరింత తెలుసుకోండి',
        'analyzeBtn': 'రిపోర్ట్ విశ్లేషించండి',
        'copyResult': 'కాపీ చేయండి',
        'printResult': 'ముద్రించండి',
        'processingTitle': 'మీ మెడికల్ రిపోర్ట్ విశ్లేషిస్తోంది...',
        'processingDesc': 'మీ రిపోర్ట్ ను సరళమైన వివరణ అందించడానికి మా AI ప్రాసెస్ చేస్తోంది',
        'resultTitle': 'సరళీకృత రిపోర్ట్ విశ్లేషణ',
        'summaryTitle': 'సారాంశం',
        'abnormalTitle': 'ముఖ్యమైన విలువలు',
        'explanationTitle': 'వైద్య పదాల వివరణ',
        'questionsTitle': 'మీ డాక్టర్ కోసం ప్రశ్నలు',
        'uploadText': 'మీ మెడికల్ రిపోర్ట్ ను ఇక్కడ డ్రాగ్ అండ్ డ్రాప్ చేయండి',
        'uploadSubtext': 'లేదా ఫైల్ బ్రౌజ్ చేయడానికి క్లిక్ చేయండి',
        'pasteText': 'మీ మెడికల్ రిపోర్ట్ టెక్స్ట్ ను ఇక్కడ పేస్ట్ చేయండి...',
        'disclaimerTitle': 'ముఖ్యమైన వారంటీ తీసుకోకపోవడం',
        'disclaimerText': 'మెడిసింప్లిఫై AI విద్యా సమాచారం మాత్రమే అందిస్తుంది మరియు ఇది ప్రొఫెషనల్ మెడికల్ సలహా, నిర్థారణ లేదా చికిత్స కు బదులు కాదు. మెడికల్ సంబంధిత ఆందోళనల కోసం ఎల్లప్పుడూ అర్హైన హెల్త్ కేర్ ప్రొవైడర్లతో సంప్రదించండి.'
    }
};

let currentLanguage = 'en';

function changeLanguage() {
    const languageSelect = document.getElementById('language-select');
    currentLanguage = languageSelect.value;
    
    // Update UI elements
    updateUIText();
    
    // Show notification
    showToast(`Language changed to ${languageSelect.options[languageSelect.selectedIndex].text}`);
}

function updateUIText() {
    const t = translations[currentLanguage];
    
    // Update button texts
    if (document.getElementById('startBtn')) {
        document.getElementById('startBtn').innerHTML = 
            `<i class="fas fa-file-medical"></i> ${t.startBtn}`;
    }
    if (document.getElementById('learnMoreBtn')) {
        document.getElementById('learnMoreBtn').innerHTML = 
            `<i class="fas fa-graduation-cap"></i> ${t.learnMoreBtn}`;
    }
    if (document.getElementById('analyzeBtn')) {
        document.getElementById('analyzeBtn').innerHTML = 
            `<i class="fas fa-sync"></i> ${t.analyzeBtn}`;
    }
    if (document.getElementById('copyResult')) {
        document.getElementById('copyResult').innerHTML = 
            `<i class="fas fa-copy"></i> ${t.copyResult}`;
    }
    if (document.getElementById('printResult')) {
        document.getElementById('printResult').innerHTML = 
            `<i class="fas fa-print"></i> ${t.printResult}`;
    }
    
    // Update processing section
    if (document.querySelector('.processing-content h3')) {
        document.querySelector('.processing-content h3').textContent = t.processingTitle;
    }
    if (document.querySelector('.processing-content p')) {
        document.querySelector('.processing-content p').textContent = t.processingDesc;
    }
    
    // Update result section titles
    if (document.querySelector('.result-header h2')) {
        document.querySelector('.result-header h2').textContent = t.resultTitle;
    }
    if (document.querySelector('.summary-section h3')) {
        document.querySelector('.summary-section h3').innerHTML = 
            `<i class="fas fa-file-alt"></i> ${t.summaryTitle}`;
    }
    if (document.querySelector('.abnormal-section h3')) {
        document.querySelector('.abnormal-section h3').innerHTML = 
            `<i class="fas fa-exclamation-triangle"></i> ${t.abnormalTitle}`;
    }
    if (document.querySelector('.explanation-section h3')) {
        document.querySelector('.explanation-section h3').innerHTML = 
            `<i class="fas fa-book"></i> ${t.explanationTitle}`;
    }
    if (document.querySelector('.questions-section h3')) {
        document.querySelector('.questions-section h3').innerHTML = 
            `<i class="fas fa-question-circle"></i> ${t.questionsTitle}`;
    }
    
    // Update upload section
    if (document.querySelector('.upload-box p:first-of-type')) {
        document.querySelector('.upload-box p:first-of-type').textContent = t.uploadText;
    }
    if (document.querySelector('.upload-box .small-text')) {
        document.querySelector('.upload-box .small-text').textContent = t.uploadSubtext;
    }
    if (document.getElementById('reportText')) {
        document.getElementById('reportText').placeholder = t.pasteText;
    }
    
    // Update disclaimer
    if (document.querySelector('.disclaimer-content h3')) {
        document.querySelector('.disclaimer-content h3').textContent = t.disclaimerTitle;
    }
    if (document.querySelector('.disclaimer-content p')) {
        document.querySelector('.disclaimer-content p').textContent = t.disclaimerText;
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUIText();
});