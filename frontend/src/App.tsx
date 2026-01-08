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
                <img src="../public/logo.png" />
              </AspectRatio>
              <AspectRatio maw={35} lightHidden>
                <img src="../public/logo-dark.png" />
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
