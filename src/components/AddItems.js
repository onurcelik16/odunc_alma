import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, List, Modal, DatePicker, Empty, Card } from 'antd';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';

const AddItems = () => {
  const location = useLocation();
  const { userName } = location.state || {};
  const [items, setItems] = useState([]);
  const name = localStorage.getItem('name');
  const [myItems, setMyItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [loanDays, setLoanDays] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [borrowedModalVisible, setBorrowedModalVisible] = useState(false);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [form] = Form.useForm();
  const [todayDate, setTodayDate] = useState(moment().format('DD.MM.YYYY'));
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchDataAndClearAPI();
  }, []);

  const fetchDataAndClearAPI = () => {
    // Başlangıçta boş veri oluşturulacak
    const allItems = [];

    setItems(allItems);

    const userItems = allItems.filter(item => item.owner === name);
    setMyItems(userItems);

    message.success('Data fetched and cleared successfully');
  };

  const addItem = () => {
    if (!itemName || !loanDays) {
      message.error('Please fill in all fields');
      return;
    }

    const newItem = { itemName, loanDays, returnDate: moment().add(loanDays, 'days').format('DD.MM.YYYY'), owner: name };
    setItems([...items, newItem]);
    setMyItems([...myItems, newItem]);
    setItemName('');
    setLoanDays('');
    message.success('Eşya listeye eklendi');
  };

  const handleSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDelete = (item) => {
    setItems(items.filter((i) => i !== item));
    setMyItems(myItems.filter((i) => i !== item));
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    message.success('Item deleted successfully');
  };

  const handleRemoveFromCart = (item) => {
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePayment = () => {
    form.validateFields()
      .then((values) => {
        message.success('Ödeme yapıldı. Faturanız kayıtlı mail üzerine gönderilecektir.');
        form.resetFields();
        setIsModalVisible(false);

        // Seçilen öğeleri sıfırla
        setSelectedItems([]);
      })
      .catch(errorInfo => {
        console.error('Validate Failed:', errorInfo);
      });
  };

  const showBorrowedModal = () => {
    setBorrowedModalVisible(true);
    // Sahte ödünç alınan eşyalar verisi
    const borrowed = [];
    setBorrowedItems(borrowed);
  };

  const handleBorrowedCancel = () => {
    setBorrowedModalVisible(false);
  };

  const handleFilter = () => {
    let filteredItems = borrowedItems;

    if (dateRange[0] && dateRange[1]) {
      filteredItems = filteredItems.filter(item => 
        moment(item.borrowedDate, 'DD.MM.YYYY').isBetween(dateRange[0], dateRange[1], 'days', '[]')
      );
    }

    return filteredItems;
  };

  return (
    <div>
      <div style={{ float: 'right', marginBottom: '20px' }}>
        <Button type="primary" danger>
          <Link to="/" onClick={() => message.success('Çıkış yapıldı')}>
            Çıkış Yap
          </Link>
        </Button>
      </div>
      
      <Form layout="inline" onFinish={addItem}>
        <Form.Item label="Eşya İsmi">
          <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Ödünç alınabilir gün sayısı">
          <Input value={loanDays} onChange={(e) => setLoanDays(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Eşya Ekle
          </Button>
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ marginRight: '20px', flex: 1 }}>
          <Card title="Tüm Eşyalar">
            {items.length === 0 ? <Empty description="No Items Available" /> : (
              <List
                bordered
                dataSource={items}
                renderItem={(item) => (
                  <List.Item>
                    Eşya İsmi: {item.itemName} - Ödünç alınabilir gün sayısı: {item.loanDays}
                    <Button onClick={() => handleSelect(item)}>Seç</Button>
                    <Button onClick={() => handleDelete(item)}>Sil</Button>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card title="Eşyalarım">
            {myItems.length === 0 ? <Empty description="No My Items Available" /> : (
              <List
                bordered
                dataSource={myItems}
                renderItem={(item) => (
                  <List.Item>
                    Eşya İsmi: {item.itemName} - Ödünç alınabilir gün sayısı: {item.loanDays}
                    <Button onClick={() => handleDelete(item)} type="primary" danger style={{ float: 'right' }}>Kaldır</Button>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Card title="Sepete Eklenecekler">
          {selectedItems.length === 0 ? <Empty description="No Items in Cart" /> : (
            <>
              <List
                bordered
                dataSource={selectedItems}
                renderItem={(item) => (
                  <List.Item>
                    Eşya İsmi: {item.itemName} - Ödünç alınabilir gün sayısı: {item.loanDays} - Teslim Tarihi: {item.returnDate}
                    <Button onClick={() => handleRemoveFromCart(item)} type="primary" danger style={{ float: 'right' }}>Kaldır</Button>
                  </List.Item>
                )}
              />
              <Button style={{ marginTop: '20px', float: 'right' }} onClick={showModal}>
                Sepete Git
              </Button>
            </>
          )}
        </Card>
      </div>

      <Button type="primary" style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={showBorrowedModal}>
        Ödünç Alınanlar
      </Button>

      <Modal
        title="Ödünç Alınan Eşyalar"
        visible={borrowedModalVisible}
        footer={[
          <Button key="kapat" onClick={handleBorrowedCancel}>
            Kapat
          </Button>,
        ]}
        onCancel={handleBorrowedCancel}
      >
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Form.Item label="Tarih Aralığı">
            <DatePicker.RangePicker
              format="DD.MM.YYYY"
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
          </Form.Item>
        </Form>
        <List
          header={<div>Eşyalar</div>}
          bordered
          dataSource={handleFilter()}
          renderItem={(item) => (
            <List.Item>
              {item.borrower} - Eşya İsmi: {item.itemName} - Ödünç alınabilir gün sayısı: {item.loanDays} - Teslim tarihi: {item.returnDate}
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title="Ödeme Ekranı"
        visible={isModalVisible}
        footer={[
          <Button key="kapat" onClick={handleCancel}>
            Kapat
          </Button>,
          <Button key="ödeme yap" type="primary" onClick={handlePayment}>
            Ödeme Yap
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <List
          header={<div>Sepetim - Günün Tarihi: {todayDate}</div>}
          bordered
          dataSource={selectedItems}
          renderItem={(item) => (
            <List.Item>
              Eşya İsmi: {item.itemName} - Ödünç alınabilir gün sayısı: {item.loanDays} - Teslim tarihi: {item.returnDate}
              <Button onClick={() => handleRemoveFromCart(item)} type="primary" danger style={{ float: 'right' }}>Kaldır</Button>
            </List.Item>
          )}
        />
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item
            label="İsim Soyisim"
            name="name"
            rules={[{ required: true, message: 'isim soyisim gir' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kart numarası"
            name="cardNumber"
            rules={[{ required: true, message: 'kart numarası gir' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tarih"
            name="expiryDate"
            rules={[{ required: true, message: 'tarih gir' }]}
          >
            <Input placeholder="AA/YY" />
          </Form.Item>
          <Form.Item
            label="CVV"
            name="cvv"
            rules={[{ required: true, message: ' CVV gir' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddItems;
