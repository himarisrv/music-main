import { DisTubeEvent } from "../..";
import { EmbedBuilder } from "discord.js";
import { Events, type Queue } from "distube";

export default class FinishEvent extends DisTubeEvent<Events.FINISH> {
  readonly name = Events.FINISH;
  run(queue: Queue) {
    queue.textChannel?.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`⏹️ | 曲が終了しました`)
          .setDescription(`キュー内に曲がありません。曲を再生する場合は\`/play\`で曲を登録してください。`)
          .setTimestamp()
          .setAuthor({
            name: `${queue.client.user?.displayName}`,
            iconURL: `${queue.client.user?.displayAvatarURL()}`,
          }),
      ],
    });
    queue.voice.leave();
  }
}
