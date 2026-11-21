import { Text } from 'react-native';
import { Action, styles as ui } from '../ui';

export function DeleteRecord({ confirming, onRequest, onCancel, onConfirm }: {
  confirming: boolean;
  onRequest: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!confirming) return <Action label="Eliminar registro" secondary onPress={onRequest} />;
  return <>
    <Text style={ui.body}>¿Eliminar este ordeño de la demostración?</Text>
    <Action label="Confirmar eliminación" onPress={onConfirm} />
    <Action label="Cancelar" secondary onPress={onCancel} />
  </>;
}
