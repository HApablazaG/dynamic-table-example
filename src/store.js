import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import uniqid from 'uniqid';

function useAppStore () {
  return useLocalObservable(
    () => {
      const exampleRow = Object.freeze({
        textValue: '',
        numberValue: '',
        selectValue: '',
        checkboxValue: ''
      });

      return {
        data: {
          exampleList: []
        },

        error: {
          exampleList: []
        },

        exampleColumn: [
          {
            title: '#',
            field: 'rowIndex',
            render: (value, index) => index + 1
          },
          {
            title: 'TextField',
            field: 'textValue',
            type: 'text',
            isMediumColumn: true
          },
          {
            title: 'NumberField',
            field: 'numberValue',
            type: 'number',
            isSmallColumn: true
          },
          {
            title: 'Select',
            field: 'selectValue',
            optionName: 'optionList',
            type: 'select',
            isMediumColumn: true
          },
          {
            title: 'Checkbox',
            field: 'checkboxValue',
            type: 'checkbox'
          }
        ],

        optionList: [
          {
            id: 1,
            label: 'Sample Value 01'
          },
          {
            id: 2,
            label: 'Sample Value 02'
          },
          {
            id: 3,
            label: 'Sample Value 03'
          },
          {
            id: 4,
            label: 'Sample Value 04'
          },
          {
            id: 5,
            label: 'Sample Value 05'
          }
        ],

        addRow () {
          runInAction(() => {
            this.data.exampleList.push({
              uid: uniqid(),
              ...exampleRow
            });

            this.error.exampleList.push({
              ...exampleRow
            });
          });
        },

        removeRow (_, index) {
          runInAction(() => {
            this.data.exampleList.splice(index, 1);
            this.error.exampleList.splice(index, 1);
          });
        },

        cleanErrorList (errorList = this.error) {
          runInAction(() => {
            for (const key in errorList) {
              if (Array.isArray(errorList[key])) {
                errorList[key].forEach(errorRow => {
                  this.cleanErrorList(errorRow);
                });
              } else if (typeof errorList[key] === 'object') {
                this.cleanErrorList(errorList[key]);
              } else {
                errorList[key] = '';
              }
            }
          });
        },

        setErrorList (errorList = {}) {
          runInAction(() => {
            for (let key in errorList) {
              // Prevent unexpected names to be added
              if (Object.hasOwnProperty.call(this.error, key)) {
                this.error[key] = errorList[key];
              }
            }
          });
        },

        generateRowStore (_, index) {
          return {
            data: this.data.exampleList[index],
            error: this.error.exampleList[index],
            optionList: this.optionList
          };
        },

        generateRowOnChange (index) {
          return event => {
            let { name, value } = event.target;

            // Prevent unexpected names to be added
            if (
              this.data.exampleList[index]
              && Object.hasOwnProperty.call(this.data.exampleList[index], name)
            ) {
              runInAction(() => {
                this.data.exampleList[index][name] = value;
              });
            }
          };
        }
      }
    }
  );
}

export default useAppStore;
