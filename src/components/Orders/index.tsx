import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";

import { Load } from "../Load";
import { Filters } from "../Filters";
import { Order, OrderProps } from "../Order";

import { Container, Header, Title, Counter } from "./styles";
import { getRealm } from "../../databases/realm";
import { useFocusEffect } from "@react-navigation/native";
import { OrderModel } from "../../databases/models/OrderModel";

export function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [status, setStatus] = useState("open");

  const increaseLoading = () => setIsLoading(true);
  const decreaseLoading = () => setIsLoading(false);

  async function fetchOrders() {
    increaseLoading();
    const realm = await getRealm();
    try {
      const response = realm
        .objects("Order")
        .filtered(`status = '${status}'`)
        .sorted("created_at")
        .toJSON();

      setOrders(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Chamado", "Não foi possível abrir o chamado!");
    } finally {
      realm.close();
      decreaseLoading();
    }
  }

  async function orderUpdate(id: string) {
    increaseLoading();
    const realm = await getRealm();
    try {
      const orderSelected = realm
        .objects<OrderModel>("Order")
        .filtered(`_id = '${id}'`)[0];

      realm.write(() => {
        orderSelected.status =
          orderSelected.status === "open" ? "closed" : "open";
      });

      Alert.alert("Chamado", "Chamdo atualizado!");
      fetchOrders();
    } catch (error) {
      Alert.alert("Chamado", "Não foi possível realizar o chamado!");
    } finally {
      decreaseLoading();
    }
  }

  function handleOrderUpdate(id: string) {
    Alert.alert("Chamado", "Encerrar chamado?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        style: "default",
        onPress: () => orderUpdate(id),
      },
    ]);
  }

  useEffect(() => {
    fetchOrders();
  }, [status]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  return (
    <Container>
      <Filters onFilter={setStatus} />

      <Header>
        <Title>Chamados {status === "open" ? "aberto" : "encerrado"}</Title>
        <Counter>{orders.length}</Counter>
      </Header>

      {isLoading ? (
        <Load />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Order onPress={() => handleOrderUpdate(item._id)} data={item} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
    </Container>
  );
}
