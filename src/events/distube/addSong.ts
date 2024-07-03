import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata } from "../..";
import type { Queue, Song } from "distube";

export default class AddSongEvent extends DisTubeEvent<Events.ADD_SONG> {
  readonly name = Events.ADD_SONG;
  run(_queue: Queue, song: Song<Metadata>) {
    song.metadata.interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`✅ | キューに曲が追加されました`)
          .setURL(`${song.url}`)
          .setDescription(`キューに${song.name}を追加しました。`)
          .setImage(`${song.thumbnail}`)
          .setTimestamp()
          .setAuthor({
            name: `${song.metadata.interaction.client.user.displayName}`,
            iconURL: `${song.metadata.interaction.client.user.displayAvatarURL()}`,
          }),
      ],
    });
  }
}
