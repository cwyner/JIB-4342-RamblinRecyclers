import { Appbar } from "react-native-paper";
import { HamburgerMenu } from "@/components/ui/HamburgerMenu";
import type { FC } from "react";

export const ScreenHeader: FC<{title: string}> = ({ title }) => {
    return (
      <Appbar.Header>
        <Appbar.Content title={title} />
        <HamburgerMenu />
      </Appbar.Header>
    )
  }