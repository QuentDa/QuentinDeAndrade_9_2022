/**
 * @jest-environment jsdom
 */

 import { screen, fireEvent } from "@testing-library/dom"
 import { waitFor } from "@testing-library/dom"
 import NewBill from "../containers/NewBill.js"
 import mockStore from "../__mocks__/store"
 import { ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import router from "../app/Router.js";
 import userEvent from "@testing-library/user-event";
 import BillsUI from "../views/BillsUI.js"
 jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  test("Then I don't have the right extension", async () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => document.querySelector("#btn-send-bill"))

      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      let fileInput = screen.queryAllByTestId('file')[0]
      const fakeFile = new File(['fake'], 'fake.zip');
      userEvent.upload(fileInput, fakeFile)

      const fnhandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fireEvent.click(fileInput, fnhandleChangeFile)
      expect(jest.spyOn(mockStore, "bills")).not.toHaveBeenCalled()
  })

  test("Then I have the right extension", async () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      jest.mock("../app/store", () => mockStore)
      await waitFor(() => document.querySelector("#btn-send-bill"))

      const submitbtn = document.querySelector('#btn-send-bill');
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      let fileInput = screen.queryAllByTestId('file')[0]
      const fakeFile = new File(['fake'], 'fake.png', { type: 'image/png' });
      userEvent.upload(fileInput, fakeFile)

      const form = screen.getByTestId('form-new-bill')
      const fnhandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const fnhandleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      fireEvent.click(fileInput, fnhandleChangeFile)
      form.addEventListener("submit", fnhandleSubmit)
      fireEvent.submit(form)
      expect(submitbtn).toBeTruthy();
      expect(jest.spyOn(mockStore, "bills")).toHaveBeenCalled()
  })

  test("fetches messages from an API and fails with 500 message error", async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { })

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      await waitFor(() => document.querySelector("#btn-send-bill"))

      mockStore.bills.mockImplementationOnce(() => {
        return {
          create: jest.fn().mockRejectedValueOnce(false)
        }
      })

      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      let fileInput = screen.queryAllByTestId('file')[0]
      const fakeFile = new File(['fake'], 'fake.png', { type: 'image/png' });
      userEvent.upload(fileInput, fakeFile)
      const fnhandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      try{
        fireEvent.click(fileInput, fnhandleChangeFile)
      }catch(error){
        expect(error).toMatch("error")
      }
  })
})