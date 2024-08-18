import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { shops, categories } from './Data'; // shops ve categories verilerini içe aktarıyoruz
import 'bootstrap/dist/css/bootstrap.min.css';

// Silme butonu için stil tanımlıyoruz
const IconButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s;
  


  &:hover {
    color: darkred;
  }
`;

// Ekle butonu için stil tanımlıyoruz
const StyledButton = styled(Button)`
  background-color: #007bff;
  border: none;


  &:hover {
    background-color: #0056b3;
  }
`;

// Form alanı için stil tanımlıyoruz
const StyledFormContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;

  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  margin-bottom: 30px;
`;

function App() {
  // Ürünler, ürün adı, seçilen market ve kategori için state tanımlıyoruz
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Filtreleme için state tanımlıyoruz
  const [filteredShopId, setFilteredShopId] = useState('');
  const [filteredCategoryId, setFilteredCategoryId] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [filteredName, setFilteredName] = useState('');

  // Ürün ekleme fonksiyonu
  const handleAddProduct = () => {
    if (productName && selectedShop && selectedCategory) {
      // Yeni bir ürün nesnesi oluşturuyoruz
      const newProduct = {
        id: Date.now(), // Eşsiz bir ID oluşturmak için timestamp kullanıyoruz
        name: productName,
        shop: selectedShop,
        category: selectedCategory,
        isBought: false // Ürün başlangıçta satın alınmamış olarak işaretlenir
      };
      // Ürünü mevcut ürünler listesine ekliyoruz
      setProducts([...products, newProduct]);
      // Formu sıfırlıyoruz
      setProductName('');
      setSelectedShop('');
      setSelectedCategory('');
    }
  };

  // Ürün satın alındı durumunu değiştirme fonksiyonu
  const handleToggleBought = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, isBought: !product.isBought } : product
    ));
  };

  // Ürünü silme fonksiyonu
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Tüm ürünlerin satın alındığı durumu kontrol eden effect
  useEffect(() => {
    if (products.length > 0 && products.every(product => product.isBought)) {
      setShowAlert(true); // Eğer tüm ürünler satın alınmışsa alert göster
    } else {
      setShowAlert(false); // eğer az bir ürün almışsa gizle
    }
  }, [products]);



  // Ürün ismine göre filtreleme işlemi
  const filteredProducts = products.filter(product => {
    return (
      (filteredShopId ? product.shop === filteredShopId : true) &&
      (filteredCategoryId ? product.category === filteredCategoryId : true) &&
      (filteredStatus === 'all' ||
        (filteredStatus === 'bought' && product.isBought) ||
        (filteredStatus === 'notBought' && !product.isBought)) &&
      (filteredName ? product.name.toLowerCase().includes(filteredName.toLowerCase()) : true)
    );
  });

  return (
    <Container>
      <h1>Alışveriş Listesi</h1>


      {/* Ürün ekleme formu */}
      <StyledFormContainer>
        <Form>
          <Form.Group>
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Market</Form.Label>
            <Form.Control
              as="select"
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Kategori</Form.Label>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <StyledButton onClick={handleAddProduct}>Ekle</StyledButton>
        </Form>
      </StyledFormContainer>

      {/* Filtreleme formu */}
      <h2>Filtreler</h2>
      <StyledFormContainer>
        <Form>
          <Form.Group>
            <Form.Label>Market</Form.Label>
            <Form.Control
              as="select"
              value={filteredShopId}
              onChange={(e) => setFilteredShopId(e.target.value)}
            >
              <option value="">Tümü</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Kategori</Form.Label>
            <Form.Control
              as="select"
              value={filteredCategoryId}
              onChange={(e) => setFilteredCategoryId(e.target.value)}
            >
              <option value="">Tümü</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Durum</Form.Label>
            <Form.Check
              type="radio"
              label="Tümü"
              name="status"
              value="all"
              checked={filteredStatus === 'all'}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Satın Alınanlar"
              name="status"
              value="bought"
              checked={filteredStatus === 'bought'}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Satın Alınmayanlar"
              name="status"
              value="notBought"
              checked={filteredStatus === 'notBought'}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              type="text"
              value={filteredName}
              onChange={(e) => setFilteredName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </StyledFormContainer>
      {/* Eğer tüm ürünler satın alındıysa gösterilecek alert */}
      {showAlert && <Alert variant="success">Alışveriş Tamamlandı</Alert>}

      {/* Ürünlerin listelendiği tablo */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Ürün Adı</th>
            <th>Market</th>
            <th>Kategori</th>
            <th>Durum</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product.id} style={{ textDecoration: product.isBought ? 'line-through' : 'none' }}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{shops.find(shop => shop.id === product.shop)?.name}</td>
              <td>{categories.find(category => category.id === product.category)?.name}</td>
              <td onClick={() => handleToggleBought(product.id)}>
                {product.isBought ? 'Satın Alındı' : 'Alınacak'}
              </td>
              <td>
                <IconButton onClick={() => handleDeleteProduct(product.id)}>&times;</IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
