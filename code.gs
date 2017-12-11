var app_id = ''
var app_key = ''
var language = 'en'

// onAddToSpace() is invoked when bot is added to a room or when
// a user initiates / re-initiates a direct message with the bot.
function onAddToSpace(e) {
  if (e.space.type === 'ROOM') {
    return { 'text': "Hello! I'm DictionaryBot. Thanks for adding me to " + e.space.displayName + ". @ mention me followed by a word you want to look up and I'll fetch the definition for you from Oxford Dictionaries." };
    return { 'text': 'Thanks for adding me to "' + e.space.displayName + '"!' };
  } else if (e.space.type === 'DM') {
    return { 'text': "Hello! I'm DictionaryBot. @ mention me followed by a word you want to look up and I'll fetch the definition for you from Oxford Dictionaries." };
  }
}

// onRemoveFromSpace() is invoked when bot is removed from a room
// or when a user removes a direct message with the bot.
function onRemoveFromSpace(e) {
  return { 'text': "Oh no. I'm sorry that I wasn't useful enough. Hopefully I can get better and change your mind." };
}

// onMessage() is invoked when user sends a message to the bot.
function onMessage(e) {
  try {
    var word_id = e.message.text
    var idx = word_id.indexOf(" ")+1
    word_id = word_id.substr(idx).toLowerCase()
      
    var url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/' + language + '/' + word_id
    var response = UrlFetchApp.fetch(url, { 'headers': {'app_id': app_id, 'app_key': app_key}, 'muteHttpExceptions': true })
    Logger.log(response)

    response = JSON.parse(response)
    var senses = response.results[0].lexicalEntries[0].entries[0].senses[0]  
    var answer = senses.definitions[0]
        
    if (senses.subsenses) {
      answer = '1. ' + senses.definitions[0]
      var i
      for (i = 0; i < senses.subsenses.length; i++) {
        Logger.log(senses.subsenses[i])
        answer = answer + '\n' + (i+2) + '. ' + senses.subsenses[i].definitions[0]
      }
    }
    
    return { 'text': '```' + answer + '```' };
  } catch(err) {
    Logger.log(err)
    return { 'text': "Sorry. I couldn't look that up. The word doesn't exist or something went wrong." }
  }
}

