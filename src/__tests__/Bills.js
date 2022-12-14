/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"
import mockStore from "../__mocks__/store"
import "@testing-library/jest-dom"

import router from "../app/Router.js"
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //test
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const classBill = new Bills({document, onNavigate, store:mockStore, localStorage:null})
      const receivedBills = await classBill.getBills()
      const dates = receivedBills.map(bill => bill.date)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe("Given i click on the new bill button", () => {
  test("Then the modal shows up", async () => {
    document.body.innerHTML = BillsUI({ data: bills })
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)

    await waitFor(() => screen.getByTestId('btn-new-bill'))

    const btnNewBill = screen.getByTestId('btn-new-bill')

    userEvent.click(btnNewBill)

    await waitFor(() => screen.getByTestId('form-new-bill'))
    
    expect(screen.getByTestId('form-new-bill')).toBeTruthy()
  })
})

describe("Given I click on the eye icon", () => {
  test("Then the modal with image shows up", async () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)
    const iconEye = screen.getAllByTestId("icon-eye");
    const modaleFile = document.getElementById("modaleFile")
    $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))
    iconEye.forEach((icon) => {
      userEvent.click(icon)
      expect(modaleFile).toHaveClass("show")
    })
  })
})