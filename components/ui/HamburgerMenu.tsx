import React, { useState } from 'react';
import { Menu, Divider, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useSession } from '@/components/providers/SessionProvider';
import { useRouter } from 'expo-router';

export const HamburgerMenu = () => {
  const [visible, setVisible] = useState(false);
  const { signOut } = useSession()
  const router = useRouter()

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchorPosition="bottom"
      anchor={
        <IconButton
          icon="menu"
          size={24}
          onPress={openMenu}
        />
      }
    >
      <Menu.Item onPress={() => router.push("/teams")} title="Teams" />
      <Menu.Item onPress={() => router.push("/settings")} title="Settings" />
      <Divider />
      <Menu.Item onPress={() => signOut()} title="Sign Out" />
    </Menu>
  );
};
