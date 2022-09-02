/**
 * @jest-environment jsdom
 */

import { fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import router from "../app/Router.js"
import {screen, waitFor} from "@testing-library/dom"


describe("Given I am connected as an employee", () => {
  describe("When I don't have any .store", () => {
    test("Then I should have an alert", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBillInit = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      expect(() => { newBillInit.updateBill(null)}).toThrow()
    })
  })

  describe("When I click on the button to submit a new bill", () => {
    test("Then the handleSubmit method is called", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
  
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
  
      const html = NewBillUI()
      document.body.innerHTML = html
  
      const newBillInit = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
  
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeTruthy()
      
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    })
  })
})