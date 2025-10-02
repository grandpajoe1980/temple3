import { useState } from 'react';
import CreateTempleForm from '../auth/CreateTempleForm';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const CreateTempleButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setShowModal(true)}
      >
        Create a Temple
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Your Temple"
        size="lg"
      >
        <CreateTempleForm onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};

export default CreateTempleButton;
