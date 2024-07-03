import { Events } from "distube";
import { DisTubeEvent } from "../..";
import { EmbedBuilder } from "discord.js";
import type { DisTubeError, Queue } from "distube";

export default class NoRelatedEvent extends DisTubeEvent<Events.NO_RELATED> {
  readonly name = Events.NO_RELATED;
  run(queue: Queue, error: DisTubeError) {
    queue.textChannel?.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#e06666")
          .setTitle(`🚧 | エラーが発生しました`)
          .setDescription(`次のエラーが発生しました。\n \`\`\`${error.message}\`\`\``)
          .setTimestamp()
          .setAuthor({
            name: `${queue.client.user?.displayName}`,
            iconURL: `${queue.client.user?.displayAvatarURL()}`,
          }),
      ],
    });
  }
}
