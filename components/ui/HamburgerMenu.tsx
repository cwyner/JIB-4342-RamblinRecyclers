import React, { useState } from 'react';
import { Menu, Divider, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { useSession } from '@/components/providers/SessionProvider';

export const HamburgerMenu = () => {
  const [visible, setVisible] = useState(false);
  const { signOut } = useSession()

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchorPosition="bottom"
      anchor={
        <IconButton
          icon="menu" // Hamburger icon from react-native-paper's Material Design icons
          size={24}
          onPress={openMenu}
        />
      }
    >
      <Menu.Item onPress={() => {}} title="Teams" />
      <Divider />
      <Menu.Item onPress={() => signOut()} title="Sign Out" />
    </Menu>
  );
};
