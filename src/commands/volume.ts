import { Command } from "..";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default class VolumeCommand extends Command {
  readonly name = "volume";
  override readonly inVoiceChannel = true;
  override readonly playing = true;
  readonly slashBuilder = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("音量を設定します")
    .addNumberOption(option =>
      option.setName("volume").setDescription("音量(0~1000)").setMinValue(0).setMaxValue(1000).setRequired(true),
    );
  async onChatInput(interaction: ChatInputCommandInteraction<"cached">) {
    const volume = interaction.options.getNumber("volume", true);
    this.distube.setVolume(interaction, volume);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#6fa8dc")
          .setTitle(`🔊 | 音量を変更しました`)
          .setDescription(`現在の音量: ${volume}`)
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.displayName}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          }),
      ],
    });
  }
}
