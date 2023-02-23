import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import App from "../App"

test('hata olmadan render ediliyor', () => {
    render(<App/>);
});

test('iletişim formu headerı render ediliyor', () => {
render(<IletisimFormu/>);
const header=screen.getByText(/İletişim Formu/i);
expect(header).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);
    const userChecked=screen.getByPlaceholderText("İlhan");
    userEvent.type(userChecked,"ömür");
    expect(await screen.findByTestId("error")).toBeInTheDocument();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
   userEvent.click(screen.getByRole("button"));
   expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const userChecked=screen.getByPlaceholderText("İlhan");
    userEvent.type(userChecked,"ömürcan");
    const surnameChecked=screen.getByPlaceholderText("Mansız");
    userEvent.type(surnameChecked,"uslu");
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findAllByTestId("error")).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    const emailChecked=screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailChecked,"uslu");
    expect(await screen.findByTestId("error")).toHaveTextContent(/email geÇerli bir Email adresi olmalıdır./i);

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    const userChecked=screen.getByPlaceholderText("İlhan");
    userEvent.type(userChecked,"ömürcan");
    const emailChecked=screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailChecked,"aliveli49Elli@outlook.com");
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findAllByTestId("error")).toHaveLength(1);
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.',  () => {
    render(<IletisimFormu/>);
    const userChecked=screen.getByPlaceholderText("İlhan");
    userEvent.type(userChecked,"ömürcan");
    const surnameChecked=screen.getByPlaceholderText("Mansız");
    userEvent.type(surnameChecked,"uslu");
    const emailChecked=screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailChecked,"aliveli49Elli@outlook.com");
    userEvent.click(screen.getByRole("button"));
    expect( screen.queryAllByTestId("error")).toHaveLength(0);
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async() => {
    render(<IletisimFormu/>);
    const userChecked=screen.getByPlaceholderText("İlhan");
    userEvent.type(userChecked,"ömürcan");
    const surnameChecked=screen.getByPlaceholderText("Mansız");
    userEvent.type(surnameChecked,"uslu");
    const emailChecked=screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailChecked,"aliveli49Elli@outlook.com");
    const messageChecked=screen.getByText("Mesaj");
    userEvent.type(messageChecked,"afiyetler Olsunn");
    userEvent.click(screen.getByRole("button"));

   await waitFor(()=>{
   expect( screen.getByTestId("firstnameDisplay")).toHaveTextContent(/ömürcan/i);
   expect( screen.getByTestId("lastnameDisplay")).toHaveTextContent(/uslu/i);
   expect( screen.getByTestId("emailDisplay")).toHaveTextContent(/aliveli49Elli@outlook.com/i);
   expect( screen.getByTestId("messageDisplay")).toHaveTextContent(/afiyetler Olsunn/i);

})
   })