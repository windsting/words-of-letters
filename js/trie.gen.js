class TrieNode {
    constructor() {
        this.c = {};
        // this.w = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.c[char]) {
                node.c[char] = new TrieNode();
            }
            node = node.c[char];
        }
        node.w = true;
    }

    search(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.c[char]) {
                return false;
            }
            node = node.c[char];
        }
        return node.w;
    }

    // Convert the Trie to a JSON string
    toJSON() {
        return JSON.stringify(this.root);
    }

    // Load the Trie from a JSON object
    fromJSON(json) {
        this.root = JSON.parse(json);
    }
}

// Create a new Trie instance
const trie = new Trie();

// Save the Trie as a downloadable file
function saveTrie() {
    const data = trie.toJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trie_data.json';  // File name for download
    a.click();

    // Revoke the object URL after the download
    URL.revokeObjectURL(url);
}

// Load the Trie from a file selected by the user
function loadTrieFromFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            trie.fromJSON(content);
            alert("Trie loaded successfully from file.");
        };
        reader.readAsText(file);
    };

    // Trigger the file input dialog
    fileInput.click();
}

// Check if the Enter key is pressed, and if so, trigger the search
function checkEnter(event) {
    if (event.key === 'Enter') {
        searchWordPermutations();  // Trigger search function
    }
}

// Generate all permutations of the input string from length 2 to the full length
function getPermutations(str) {
    const result = new Set();  // Using a set to avoid duplicates
    const permute = (prefix, remaining) => {
        const LengthMin = 3;
        if (prefix.length >= LengthMin) {
            result.add(prefix);
        }
        for (let i = 0; i < remaining.length; i++) {
            permute(prefix + remaining[i], remaining.slice(0, i) + remaining.slice(i + 1));
        }
    };
    permute('', str);
    return Array.from(result);
}

// Search permutations of the input string in the Trie
function searchWordPermutations() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (!searchInput) {
        alert("Please enter a word to search.");
        return;
    }

    const permutations = getPermutations(searchInput);
    const matchedWords = [];

    for (let perm of permutations) {
        if (trie.search(perm)) {
            matchedWords.push(perm);
        }
    }

    displayResults(matchedWords);
}

// Display the matched words, grouped by length, with longer words first
function displayResults(matchedWords) {
    const resultDiv = document.getElementById('searchResult');
    resultDiv.innerHTML = '';  // Clear previous results

    if (matchedWords.length === 0) {
        resultDiv.textContent = "No matched words found.";
        return;
    }

    // Group words by their lengths
    const groupedByLength = {};
    matchedWords.forEach(word => {
        const length = word.length;
        if (!groupedByLength[length]) {
            groupedByLength[length] = [];
        }
        groupedByLength[length].push(word);
    });

    // Sort the lengths in descending order (longer words first)
    const sortedLengths = Object.keys(groupedByLength).sort((a, b) => b - a);

    // Display each group of words, sorted alphabetically within the group
    sortedLengths.forEach(length => {
        const words = groupedByLength[length].sort();  // Sort alphabetically

        const groupHeading = document.createElement('h3');
        groupHeading.textContent = `Words of length ${length}`;
        resultDiv.appendChild(groupHeading);

        const ul = document.createElement('ul');
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            ul.appendChild(li);
        });
        resultDiv.appendChild(ul);
    });
}

// Load words from a selected file and insert them into the Trie
function loadWordsFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a text file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const words = content.split(/\r?\n/);  // Split by newlines
        for (let word of words) {
            word = word.trim();
            if (word) {
                trie.insert(word);  // Insert each word into the Trie
            }
        }
        alert("Words loaded successfully into the Trie.");
    };
    reader.readAsText(file);
}

// load default trie
function LoadFile() {
    var oFrame = document.getElementById("frmFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var words = strRawContents.split("\n");
    for (let word of words) {
        word = word.trim();
        if (word) {
            trie.insert(word);  // Insert each word into the Trie
        }
    }
    // alert("Words loaded successfully into the Trie.");
}