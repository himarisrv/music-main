import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Metadata } from "..";
import type { ChatInputCommandInteraction } from "discord.js";

export default class PlayCommand extends Command {
  readonly name = "play";
  override readonly inVoiceChannel = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("play")
    .setDescription("URLやキーワードから音楽を再生します")
    .addStringOption(opt => opt.setName("input").setDescription("URLあるいはキーワード").setRequired(true))
    .addBooleanOption(opt => opt.setName("skip").setDescription("現在の曲をスキップ").setRequired(false))
    .addIntegerOption(opt => opt.setName("position").setDescription("キュー内の位置に追加").setRequired(false));
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const input = interaction.options.getString("input", true);
    const skip = interaction.options.getBoolean("skip", false) ?? false;
    const position = interaction.options.getInteger("position", false) ?? undefined;
    const vc = interaction.member?.voice?.channel;
    if (!vc) return; // Handled by inVoiceChannel property
    await interaction.deferReply();
    this.client.distube
      .play<Metadata>(vc, input, {
        skip,
        position,
        textChannel: interaction.channel ?? undefined,
        member: interaction.member,
        metadata: { interaction },
      })
      .catch(e => {
        console.error(e);
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#e06666")
              .setTitle(`🚧 | エラーが発生しました`)
              .setDescription(`次のエラーが発生しました。\n \`\`\`${e}\`\`\``)
              .setTimestamp()
              .setAuthor({
                name: `${interaction.client.user.displayName}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              }),
          ],
        });
      });
  }
}
