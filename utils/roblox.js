const fetch = require("node-fetch");

async function getRobloxAvatar(username) {
  try {
    const userRes = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    const userData = await userRes.json();
    if (!userData.data.length) return null;

    const id = userData.data[0].id;

    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png`);
    const avatarData = await avatarRes.json();

    return avatarData.data[0].imageUrl;

  } catch {
    return null;
  }
}

module.exports = { getRobloxAvatar };