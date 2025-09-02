import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="authScreen"
        options={{
          title: "Authentication",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
