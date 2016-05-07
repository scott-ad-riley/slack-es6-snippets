#ES6 Slack Snippet Posting

App/Integration that allows user to type slash commands in slack, and have a bot DM them with a snippet of example code on that feature.

Source for the snippets comes from https://github.com/DrkSephy/es6-cheatsheet/blob/master/README.md.

##Setup/Usage

I have it currently setup on a test slack team - message me and I can help you get it setup.

##TODO

* Implement some form of caching/saving snippets to save space in the slack file storage
* Handle updating the data dynamically - look into setting up a webhook on the remote repo?
* Implement a default snippet system
  * possibly allow users to set it from slack?
  * or have it use the most commonly requested snippet as the default?
    * problem becomes that people will request 1 all of the time, just because it's the first
* Possibly look at pulling out descriptions also in the cheatsheet and using them in the comments for a snippet
* Maybe implement a `/es6 [feature] all` command which just combines all of the snippets from the cheatsheet under one feature into one snippet to post into slack
* Deploy it
  * heroku for free with db
  * now for free with no db
  * DO for 100% uptime with db