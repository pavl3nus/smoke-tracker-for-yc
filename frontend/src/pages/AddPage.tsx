import { Title, Card, Center, Container } from "@mantine/core";
import { CreateSmokeLogForm } from "../components/CreateSmokeLogForm";

export default function AddPage() {
  return (
    <Container size="xl" ml="xl">
      <Title order={1} mb="md">
        Добавить запись
      </Title>
      <Center>
        <Card withBorder>
          <CreateSmokeLogForm />
        </Card>
      </Center>
    </Container>
  );
}
