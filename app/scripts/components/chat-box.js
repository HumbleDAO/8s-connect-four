// build a chatbox widget
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/chat-box.html'
], function($, _, Backbone, chatBoxTemplate) {
    var ChatBoxView = Backbone.View.extend({
        template: _.template(chatBoxTemplate),
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    return ChatBoxView;
});

