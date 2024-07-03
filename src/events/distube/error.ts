import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata, followUp } from "../..";
import type { Queue, Song } from "distube";

export default class ErrorEvent extends DisTubeEvent<Events.ERROR> {
  readonly name = Events.ERROR;
  async run(error: Error, queue: Queue, song?: Song<Metadata>) {
    if (song) {
      await followUp(
        song.metadata.interaction,
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`🚧 | エラーが発生しました`)
          .setDescription(`次のエラーが発生しました。\n \`\`\`${error.message}\`\`\``)
          .setTimestamp()
          .setAuthor({
            name: `${song.metadata.interaction.client.user.displayName}`,
            iconURL: `${song.metadata.interaction.client.user.displayAvatarURL()}`,
          }),
        queue.textChannel!,
      );
    } else if (queue.textChannel) {
      await queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#6fa8dc")
            .setTitle(`🚧 | エラーが発生しました`)
            .setDescription(`次のエラーが発生しました。\n \`\`\`${error.message}\`\`\``)
            .setTimestamp()
            .setAuthor({
              name: `${queue.client.user?.displayName}`,
              iconURL: `${queue.client.user?.displayAvatarURL()}`,
            }),
        ],
      });
    } else {
      console.error(error);
    }
  }
}
