package net.essoktani.ebankbot.discord;

import com.zgamelogic.discord.annotations.DiscordController;
import com.zgamelogic.discord.annotations.DiscordMapping;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.essoktani.ebankbot.agents.EbankAIAgent;
import org.springframework.ai.chat.prompt.Prompt;

@DiscordController
public class DiscordBot {

    private final EbankAIAgent ebankAIAgent;

    public DiscordBot(EbankAIAgent ebankAIAgent) {
        this.ebankAIAgent = ebankAIAgent;
    }

    @DiscordMapping
    private void perform(MessageReceivedEvent event) {

        System.out.println("========================================");
        System.out.println("DISCORD EVENT RECEIVED!");
        System.out.println("Author: " + event.getAuthor().getName());
        System.out.println("Message: " + event.getMessage().getContentRaw());
        System.out.println("Channel: " + event.getChannel().getName());
        System.out.println("========================================");

        if (event.getAuthor().isBot()) {
            return;
        }

        String query = event.getMessage().getContentRaw();
        if (query == null || query.isBlank()) {
            System.out.println("⚠️ Warning: Received message with empty content. Ensure 'Message Content Intent' is enabled in Discord Developer Portal!");
            return;
        }

        String conversationId =
                "discord-user-" + event.getAuthor().getId()
                        + "-channel-" + event.getChannel().getId();

        try {
            String response = ebankAIAgent.chat(new Prompt(query), conversationId);
            if (response == null || response.isBlank()) {
                response = "Désolé, je n'ai pas pu générer de réponse.";
            }

            // Gérer la limite Discord de 2000 caractères par message
            if (response.length() > 2000) {
                for (int i = 0; i < response.length(); i += 1900) {
                    String chunk = response.substring(i, Math.min(i + 1900, response.length()));
                    event.getChannel().sendMessage(chunk).queue(
                        success -> {},
                        error -> System.err.println("Discord send chunk error: " + error.getMessage())
                    );
                }
            } else {
                event.getChannel()
                        .sendMessage(response)
                        .queue(
                            success -> {},
                            error -> System.err.println("Discord send error: " + error.getMessage())
                        );
            }
        } catch (Exception e) {
            System.err.println("Error processing Discord message: " + e.getMessage());
            event.getChannel()
                    .sendMessage("⚠️ Une erreur est survenue lors du traitement de votre demande : " + e.getMessage())
                    .queue(s -> {}, err -> System.err.println("Error sending failure message: " + err.getMessage()));
        }
    }
}