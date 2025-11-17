import { scale } from '@/src/utils';
import React, { FC } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TextApp from '../TextApp';

export const OPTIONS = {
  export: 'export',
  share: 'share',
  copy: 'copy',
  delete: 'delete',
};

type Props = {
  visible: boolean
  positionY: number;
  onSelectOption: (option: any) => void;
  onClose: () => void;
};

const ActionModal: FC<Props> = ({ positionY, visible, onClose, onSelectOption }: Props) => {
  const styleContent = { top: positionY + scale(44) };
  return (
    <Modal transparent={true} visible={visible} statusBarTranslucent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <View style={[styles.content, styleContent]}>
            <TouchableOpacity
              style={styles.boxOption}
              onPress={onSelectOption.bind(null, OPTIONS.export)}>
              <View style={styles.viewText}>
                <TextApp style={styles.text}>
                  Export PDF
                </TextApp>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxOption}
              onPress={onSelectOption.bind(null, OPTIONS.share)}>
              <View style={styles.viewText}>
                <TextApp style={styles.text}>
                  Share
                </TextApp>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxOption}
              onPress={onSelectOption.bind(null, OPTIONS.copy)}>
              <View style={styles.viewText}>
                <TextApp style={styles.text}>
                  Copy
                </TextApp>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxOption}
              onPress={onSelectOption.bind(null, OPTIONS.delete)}>
              <View style={styles.viewTextDelete}>
                <TextApp
                  style={[styles.text, styles.textRed]}>
                  Delete All
                </TextApp>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ActionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: scale(187),
    paddingHorizontal: scale(8),
    backgroundColor: '#232136',
    position: 'absolute',
    right: scale(8),
    borderRadius: scale(8),
    paddingVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  boxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(4),
  },
  viewText: {
    flex: 1,
    marginLeft: scale(8),
    paddingVertical: scale(4),
  },
  viewTextDelete: {
    flex: 1,
    marginLeft: scale(8),
  },
  text: {
    color: '#fff',
  },
  textRed: {
    color: '#D92D20',
  },
});
