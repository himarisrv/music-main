import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata } from "../..";
import type { Playlist, Queue } from "distube";

export default class AddListEvent extends DisTubeEvent<Events.ADD_LIST> {
  readonly name = Events.ADD_LIST;
  run(_queue: Queue, playlist: Playlist<Metadata>) {
    playlist.metadata.interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`✅ | キューにプレイリストが追加されました`)
          .setURL(`${playlist.url}`)
          .setImage(`${playlist.thumbnail}`)
          .setDescription(`キューに${playlist.name}(\`${playlist.songs.length}\`曲)を追加しました。`)
          .setTimestamp()
          .setAuthor({
            name: `${playlist.metadata.interaction.client.user.displayName}`,
            iconURL: `${playlist.metadata.interaction.client.user.displayAvatarURL()}`,
          }),
      ],
    });
  }
}
