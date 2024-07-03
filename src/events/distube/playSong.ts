import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata, followUp } from "../..";
import type { Queue, Song } from "distube";
import { error } from "console";

export default class PlaySongEvent extends DisTubeEvent<Events.PLAY_SONG> {
  readonly name = Events.PLAY_SONG;
  run(queue: Queue, song: Song<Metadata>) {
    followUp(
      song.metadata.interaction,
      new EmbedBuilder()
        .setColor("#6fa8dc")
        .setTitle(`:arrow_forward: | 再生中: ${song.name}`)
        .setURL(`${song.url}`)
        .setDescription(
          [
            `${song.name} - \`${song.formattedDuration}\`を再生しています。\nプロバイダー: ${song.source} \n`,
            `**📋キュー内の曲:**\n${
              queue.songs
                .slice(1, 10)
                .map((song, i) => `**${i + 1}.** ${song.name || song.url} - \`${song.formattedDuration}\``)
                .join("\n") || "なし"
            }`,
          ].join("\n"),
        )
        .setImage(`${song.thumbnail}`)
        .setTimestamp()
        .setAuthor({
          name: `${song.metadata.interaction.client.user.displayName}`,
          iconURL: `${song.metadata.interaction.client.user.displayAvatarURL()}`,
        }),
      queue.textChannel!,
    ).catch(error);
  }
}
