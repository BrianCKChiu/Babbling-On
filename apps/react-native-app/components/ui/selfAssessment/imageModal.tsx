import React from 'react';
import { Modal, Image, VStack, Button } from 'native-base';
import { ImageResizeMode, ImageStyle } from 'react-native';

type ImageModalProps = {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
};

const ImageModal: React.FC<ImageModalProps> = ({ isVisible, imageUri, onClose }) => {
  const styles: { modalImage: ImageStyle } = {
    modalImage: {
      width: '100%', 
      height: 300, 
      resizeMode: 'contain' as ImageResizeMode,
    },
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="lg">
      <Modal.Content maxWidth="400px">
        <Modal.Header>Your Attempt:</Modal.Header>
        <Modal.Body>
          <VStack space={4} alignItems="center">
            <Image source={{ uri: imageUri }} alt="Captured image" style={styles.modalImage} />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            flex="1" 
            onPress={onClose}
            bgColor="#FFED4B" 
            _text={{ color: 'black', fontWeight: 'bold' }} 
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ImageModal;
