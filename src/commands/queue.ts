import { Command } from "..";
import { RepeatMode } from "distube";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class QueueCommand extends Command {
  readonly name = "queue";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder().setName("queue").setDescription("現在のキュー内の曲を表示します");
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const queue = this.distube.getQueue(interaction);
    if (!queue) return; // Handled by playing property
    const song = queue.songs[0];
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`📋 | キューの情報`)
          .setDescription(
            [
              `**:arrow_forward:現在再生中:**\n ${song.name || song.url} - \`${queue.formattedCurrentTime}\`/\`${
                song.stream.playFromSource ? song.formattedDuration : song.stream.song?.formattedDuration
              }\`\n`,
              `**📋キュー内の曲:**\n${
                queue.songs
                  .slice(1, 10)
                  .map((song, i) => `**${i + 1}.** ${song.name || song.url} - \`${song.formattedDuration}\``)
                  .join("\n") || "なし"
              }`,
            ].join("\n"),
          )
          .addFields(
            {
              name: "🔊音量",
              value: `${queue.volume}%`,
              inline: true,
            },
            {
              name: "🔀自動再生",
              value: `${queue.autoplay ? "オン" : "オフ"}`,
              inline: true,
            },
            {
              name: "🔁ループ",
              value: `${
                queue.repeatMode === RepeatMode.QUEUE
                  ? "🔁 キュー全体をループ"
                  : queue.repeatMode === RepeatMode.SONG
                    ? "🔂 現在の曲をループ"
                    : "⏹️ ループ無効"
              }`,
              inline: true,
            },
            {
              name: "🔎フィルタ",
              value: `${queue.filters.names.join(", ") || "無効"}`,
              inline: false,
            },
          ),
      ],
    });
  }
}
