import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";

import { Container, Header, Title, Form } from "./styles";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { TextArea } from "../../components/TextArea";
import { IconButton } from "../../components/IconButton";
import { getRealm } from "../../databases/realm";
import { OrderModel } from "../../databases/models/OrderModel";
import { Alert } from "react-native";

export function NewOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation();

  const increaseLoading = () => setIsLoading(true);

  const decreaseLoading = () => setIsLoading(false);

  function handleBack() {
    navigation.goBack();
  }

  async function handleNewOrderRegister() {
    increaseLoading();
    const realm = await getRealm();
    try {
      realm.write(() => {
        const created = realm.create("Order", {
          _id: uuid.v4(),
          patrimony,
          equipment,
          description,
          status: "open",
          created_at: new Date(),
        });
        console.log("CADASTRADO =>", created);
      });

      Alert.alert("Chamdo", "Chamado cadastrado com sucesso!");

      handleBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Chamado", "Não foi possível abrir o chamado!");
    } finally {
      realm.close();
      decreaseLoading();
    }
  }

  return (
    <Container>
      <Header>
        <Title>Novo chamado</Title>
        <IconButton icon="chevron-left" onPress={handleBack} />
      </Header>

      <Form>
        <Input placeholder="Número do Patrimônio" onChangeText={setPatrimony} />

        <Input placeholder="Equipamento" onChangeText={setEquipment} />

        <TextArea
          placeholder="Descrição"
          autoCorrect={false}
          onChangeText={setDescription}
        />
      </Form>

      <Button
        onPress={handleNewOrderRegister}
        title="Enviar chamado"
        isLoading={isLoading}
      />
    </Container>
  );
}
