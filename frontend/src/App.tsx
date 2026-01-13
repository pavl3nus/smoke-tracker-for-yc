import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppShell,
  Group,
  Text,
  NavLink,
  AspectRatio,
  Burger,
} from "@mantine/core";
import { IconHome, IconHistory, IconPlus, IconGraph } from "@tabler/icons-react";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import AddPage from "./pages/AddPage";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useDisclosure } from "@mantine/hooks";
import GraphicsPage from "./pages/GraphicsPage";

function App() {
  const [opened, { toggle: toggleDesktop }] = useDisclosure(false);

  return (
    <Router>
      <AppShell
        padding="md"
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { desktop: !opened },
        }}
        header={{
          height: 60,
        }}
      >
        <AppShell.Header p="xs">
          <Group justify="space-between">
            <Group align="center">
              <Burger
                opened={opened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
              <AspectRatio maw={35} darkHidden>
                <img src="https://storage.yandexcloud.net/smoke-tracker/logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJE3fC2_nXMBD7n9CQTfgjM%2F20260113%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20260113T071327Z&X-Amz-Expires=86400&X-Amz-Signature=5f949b5532d421a78ae4dd80a1cf766f808783cbc63440202f8d06dfa20efb13&X-Amz-SignedHeaders=host&response-content-disposition=attachment" />
              </AspectRatio>
              <AspectRatio maw={35} lightHidden>
                <img src="https://storage.yandexcloud.net/smoke-tracker/logo-dark.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJE3fC2_nXMBD7n9CQTfgjM%2F20260113%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20260113T071209Z&X-Amz-Expires=86400&X-Amz-Signature=a86e99f68899b26fcedca72b3c6fa391e89c753e7471c6d2571f3e4e3918148e&X-Amz-SignedHeaders=host&response-content-disposition=attachment" />
              </AspectRatio>
              <Text size="xl" fw={700}>
                SmokeTracker
              </Text>
            </Group>
            <ThemeSwitcher />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="xs">
          <AppShell.Section grow mt="md">
            <NavLink
              component={Link}
              to="/"
              label="Главная"
              leftSection={<IconHome size="1rem" />}
            />
            <NavLink
              component={Link}
              to="/Graphics"
              label="График"
              leftSection={<IconGraph size="1rem" />}
            />
            <NavLink
              component={Link}
              to="/history"
              label="История"
              leftSection={<IconHistory size="1rem" />}
            />
            <NavLink
              component={Link}
              to="/add"
              label="Добавить запись"
              leftSection={<IconPlus size="1rem" />}
            />
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/Graphics" element={<GraphicsPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;
