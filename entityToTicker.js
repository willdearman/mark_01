module.exports = {
    'bank of america': {
        nativeExchange: 'NYSE',
        nativeTicker: 'BAC',
        fullName: 'Bank of America Corporation',
        knownAs: {
            informalNames: 'BofA',
            informalNames: 'Bank of America',
            informalNames: 'BAC',
            informalNames:'BOA'
        },
        website: 'https://www.bankofamerica.com/',
        description: "A big bank",
        indices: {
            equityIndex: 'S&P 500'
        }
    },
    'JP Morgan': {
        nativeExchange: 'NYSE',
        nativeTicker: 'JP',
        fullName: 'J. P. Morgan Chase',
        knownAs: {
            informalNames:'Chase',
            informalNames:'JP',
            informalNames:'JPMC',
            informalNames:'JP Morgan',
            informalNames:'J.P. Morgan',
            informalNames:'J. P. Morgan'
        },
        website: 'https://www.jpmorgan.com/',
        description: 'A big bank',
        indices: {
            equityIndex: 'S&P 500'
        }
    },    
    'Microsoft': {
        nativeExchange: 'NASDAQ',
        nativeTicker: 'MSFT',
        fullName: 'Microsoft Corporation',
        knownAs: {
            informalNames: 'MSFT',
            informalNames: 'Microsoft'
        },
        website: 'https://www.microsoft.com/',
        description: 'Start it up, Bill',
        indices: {}
    },  
    'Twitter': {
        nativeExchange: 'NASDAQ',
        nativeTicker: 'TWTR',
        fullName: 'Twitter, Inc.',
        knownAs: {
            informalNames: 'Twitter',
            informalNames: 'TWTR',
            informalNames:'Twit'
        },
        website: 'https://www.twitter.com/',
        description: 'The site where you can describe what you had for breakfast or listen to your next presiden.',
        indices: {
            equityIndex: 'Tech 1'
        }
    },
    'informal company name': {
        nativeExchange: '',
        nativeTicker: '',
        fullName: '',
        knownAs: {
            informalNames:'something',
        },
        website: 'https://??/',
        description: '',
        indices: {
            equityIndex:'somethign'
        }
    }
};

var data = {
  'Microsoft': {
      acquisitions: 170,
      ipoDate: 'Mar 13, 1986',
      headquarters: 'Redmond, WA',
      description: 'Microsoft, a software corporation, develops licensed and support products and services ranging from personal use to enterprise application.',
      founders: 'Bill Gates and Paul Allen',
      website: 'http://www.microsoft.com'
  },
  'Apple': {
      acquisitions: 72,
      ipoDate: 'Dec 19, 1980',
      headquarters: 'Cupertino, CA',
      description: 'Apple is a multinational corporation that designs, manufactures, and markets consumer electronics, personal computers, and software.',
      founders: 'Kevin Harvey, Steve Wozniak, Steve Jobs, and Ron Wayne',
      website: 'http://www.apple.com'
  },
  'Google': {
      acquisitions: 39,
      ipoDate: 'Aug 19, 2004',
      headquarters: 'Mountain View, CA',
      description: 'Google is a multinational corporation that is specialized in internet-related services and products.',
      founders: 'Baris Gultekin, Michoel Ogince, Sergey Brin, and Larry Page',
      website: 'http://www.google.com'
  },
  'Amazon': {
      acquisitions: 58,
      ipoDate: 'May 15, 1997',
      headquarters: 'Seattle, WA',
      description: 'Amazon.com is an international e-commerce website for consumers, sellers, and content creators.',
      founders: 'Sachin Agarwal and Jeff Bezos',
      website: 'http://amazon.com'
  }
};