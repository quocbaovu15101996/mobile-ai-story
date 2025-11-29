import React, { FC, useEffect } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import TextApp from '../TextApp';

interface Props {
  /**
   * Toggles the visibilty of modal
   * @param bool modalVisible
   */
  modalVisible: boolean;

  /**
   * Color of Activity Indicator (loading circle)
   * @param string color
   */
  color?: string;

  /**
   * Text to display with the  Loading....
   * @param string title
   */
  title?: string;

  /**
   * Children of the component
   * @param React.ReactNode children
   */
  children?: React.ReactNode;

  /**
   * Function to call when modal is dismissed
   * @param () => void onDismiss
   */
  onDismiss?: () => void;
}

const ModalLoading: FC<Props> = (props: Props) => {
  const { title, modalVisible, children, onDismiss } = props;

  const onDismissModal = () => {
    onDismiss?.();
  };

  useEffect(() => {
    if (!modalVisible) {
      onDismissModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);
  return (
    <Modal
      onDismiss={onDismissModal}
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}>
      <View style={styles.centeredView}>
        {children ?? (
          <View style={styles.modalView}>
            <ActivityIndicator color={'#000'} size={'large'} />
            <TextApp style={styles.modalText}>{title ?? 'Loading..'}</TextApp>
          </View>
        )}
      </View>
    </Modal>
  );
};

export { ModalLoading };

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  modalView: {
    margin: 20,
    width: 200,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 17,
    marginLeft: 15,
    color: '#222',
  },
});
