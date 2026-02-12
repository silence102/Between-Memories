import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { pickSentence } from "../lib/sentence-engine";
import type { Message } from "../lib/types";

export default function HomeScreen() {
  const [sentence, setSentence] = useState<string | null>(null);
  const [isSilence, setIsSilence] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSentence();
  }, []);

  async function loadSentence() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get user language
      const { data: profile } = await supabase
        .from("users")
        .select("language")
        .eq("id", user.id)
        .single();

      const language = profile?.language ?? "ko";
      const message = await pickSentence(user.id, language);

      if (message === null) {
        setIsSilence(true);
        setSentence(null);
      } else {
        setIsSilence(false);
        setSentence(message.text);
      }
    } catch {
      setSentence(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {loading ? null : isSilence ? (
          // Silence: just whitespace. This is a feature, not a bug.
          <View style={styles.silenceSpace} />
        ) : sentence ? (
          <Text style={styles.sentence}>{sentence}</Text>
        ) : (
          <Text style={styles.sentence}>...</Text>
        )}
      </View>

      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>나가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  sentence: {
    fontFamily: "serif",
    fontSize: 20,
    color: "#e8e4df",
    textAlign: "center",
    lineHeight: 32,
  },
  silenceSpace: {
    height: 32,
  },
  signOut: {
    paddingBottom: 48,
    alignItems: "center",
  },
  signOutText: {
    color: "#555",
    fontSize: 13,
  },
});
