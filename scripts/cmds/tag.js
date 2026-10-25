module.exports = {
  config: {
    name: "tag",
    role: 0,
    noPrefix: true,
    author: "AHMED TARIF",
    countDown: 3,
    category: "Group"
  },

  onStart: async ({ api, event, args, usersData, threadsData }) => {
    const { threadID, messageID, messageReply, senderID } = event;

    try {
      const { members = [] } = await threadsData.get(threadID);

      let ids = [];
      let msg = "";

      if (messageReply) {
        ids = [messageReply.senderID];
        msg = args.join(" ");
      } else if (args[0]?.toLowerCase() === "all") {
        ids = members.map(i => i.userID);
        msg = args.slice(1).join(" ");
      } else if (args.length) {
        ids = members
          .filter(i => i.name.toLowerCase().includes(args[0].toLowerCase()))
          .map(i => i.userID);

        if (!ids.length)
          return api.sendMessage("❌ User not found.", threadID, messageID);

        msg = args.slice(1).join(" ");
      } else {
        ids = [senderID];
      }

      const body = ids.length > 1 ? "• শুনছো সবাই 📢" : "• Oi শুনছো";

      return api.sendMessage({
        body: msg ? `${body}\n✆| • ${msg}` : body,
        mentions: ids.map(id => ({
          id,
          tag: body,
          fromIndex: 0
        }))
      }, threadID, messageReply ? messageReply.messageID : messageID);

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ " + e.message, threadID, messageID);
    }
  }
};
