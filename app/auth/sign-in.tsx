import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const SignInScreen = () => {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      if (!signIn) throw new Error("Sign-in instance is undefined.");

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/(tabs)"); // Redirect to the main app
      } else {
        console.log("Sign-in status:", result);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? "Signing in..." : "Sign In"} onPress={handleSignIn} disabled={loading} />

      {/* Sign-up Button */}
      <TouchableOpacity onPress={() => router.push("./sign-up")} style={styles.signUpButton}>
        <Text style={styles.signUpText}>No account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: "red", marginBottom: 10 },
  signUpButton: { marginTop: 15, alignItems: "center" },
  signUpText: { color: "blue", fontSize: 16, fontWeight: "500" },
});
