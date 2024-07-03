import { ClientEvent } from "../..";
import type { Interaction } from "discord.js";
import { EmbedBuilder } from "discord.js";

export default class InteractionCreateEvent extends ClientEvent<"interactionCreate"> {
  readonly name = "interactionCreate";
  async run(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;
    if (interaction.isChatInputCommand()) {
      const cmd = this.client.commands.get(interaction.commandName);
      if (!cmd) return;
      if (cmd.inVoiceChannel && !interaction.member.voice.channel) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#6fa8dc")
              .setTitle(`❌ | ボイスチャンネルに参加してください`)
              .setDescription(`曲を再生するには再生したいボイスチャンネルに参加する必要があります。`)
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
        return;
      }
      if (cmd.playing && !this.distube.getQueue(interaction)) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#6fa8dc")
              .setTitle(`❌ | 曲が再生されていません`)
              .setDescription(`このコマンドを実行する前に曲を再生してください。`)
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
        return;
      }
      await cmd.onChatInput(interaction);
    }
  }
}
