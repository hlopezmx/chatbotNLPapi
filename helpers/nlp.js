var utils = require('./utils.js');
var natural = require('natural');

// CONSTRUCTOR
var NLP = function () {
    // we load the classifier
    natural.BayesClassifier.load('classifier.json', null, function (err, classifier) {
        if (err) {
            console.log('Classifier not accessible. Details follow: ');
            console.log(err);
        }

        // we store the classifier in prototype for reuse
        NLP.prototype.classifier = classifier;
    });
};


// We can load the classifier on demand
NLP.prototype.loadClassifier = function () {
    natural.BayesClassifier.load('classifier.json', null, function (err, classifier) {

        // we store the classifier in prototype for reuse
        NLP.prototype.classifier = classifier;
    });
}

// Classifier training on demand
NLP.prototype.train = function (trainingFile) {

    var classifier = new natural.BayesClassifier();

    console.log('Starting training.');

    // Read the training file
    var contentLines = utils.readfile(trainingFile);
    console.log('Done reading ' + contentLines.length + ' lines.');

    // get the sentences and their labels
    contentLines.forEach(function (item, index, array) {

        //format is: first word for label, rest for sentence.
        var sentence = item.substr(item.indexOf(' ') + 1);
        var label = item.substr(0, item.indexOf(' '));

        // add sentence (a.k.a. document) to classifier
        classifier.addDocument(sentence, label);
    });

    // train and store the classifier into a file
    classifier.train();
    classifier.save('classifier.json', function (err, classifier) {
        // the classifier is saved to the classifier.json file!
        console.log('training complete.');

        // test
        var testSentence = 'Hello chatbot, how are you?';
        console.log('Test Sentence:' + testSentence);
        console.log(classifier.classify(testSentence));
        console.log(classifier.getClassifications(testSentence));
    });
}

NLP.prototype.classifierOnline = function ()
{
    if (!NLP.prototype.classifier) {
        console.log('Classifier not accessible.');
        return false;
    } else {
        return true;
    }
}

// get a response based on the message (and its classified intent)
NLP.prototype.getResponse = function (message) {
    if (!NLP.prototype.classifier) {
        console.log('Classifier not accessible.');
        return false;
    } else {
        console.log('Message received: ' + message);
        var intent = NLP.prototype.getIntent(message);
        console.log(NLP.prototype.classifier.getClassifications(message));
        var response = NLP.prototype.generateResponse(message, intent);
        console.log('Response: [' + intent + ']' + response);
        return [intent, response];
    }

}


NLP.prototype.generateResponse = function (message, intent) {
    var aResponses = {};
    aResponses['GREETING'] = [
        'Hello.',
        'Hi.',
        'Hey.',
        'Hi, I\'m a bot.',
        'Hi, I\'m not human.',
    ];
    aResponses['FAREWELL'] = [
        'Bye.',
        'Goodbye.',
        'See you later.',
        'Bye, it was a nice chat',
    ];
    aResponses['NEGATION'] = [
        'why so negative?',
        'ok, I have no problem with that.',
        'ok.',
    ];
    aResponses['CONFIRMATION'] = [
        'You are so positive.',
        'We agree then.',
        'Ok.',
    ];
    aResponses['THANKS'] = [
        'You\'re welcome.',
        'No problem.',
    ];
    aResponses['CONFUSION'] = [
        'Do you have more questions?',
        'You seem confused.',
        'I might not be good explaining.',
    ];
    aResponses['UNKNOWN'] = [
        'I don\'t understand.',
        'I\'m confused.',
        'I don\'t know what you mean.',
    ];

    return aResponses[intent][Math.floor(Math.random() * aResponses[intent].length)];
}

// classify the intent of the message
NLP.prototype.getIntent = function (message) {
    if (!NLP.prototype.classifier) {
        console.log('Classifier not accessible.');
        return false;
    } else {
        return NLP.prototype.classifier.classify(message);
    }
}


module.exports = new NLP();
