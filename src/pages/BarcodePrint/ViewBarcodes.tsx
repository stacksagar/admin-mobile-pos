import { BarcodeT } from '../../data';
import { uid } from 'uid';
import Barcode from 'react-barcode';

interface PropsT {
  item: BarcodeT;
}

export default function ViewBarcodes({ item }: PropsT) {
  console.log('item ', item);
  return (
    <div className="print_area p-5">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
        {item?.with_multi
          ? item?.barcodes?.map((info, index) => (
              <div
                key={uid()}
                className="rounded bg-white px-1 pr-2 pt-2 pb-4 shadow"
              >
                <Barcode
                  height={60}
                  value={info?.imei || ''}
                  textAlign="left"
                />
                <div className="flex flex-col gap-1 pl-3 leading-3">
                  <small>
                    <b>{item?.product?.name}</b>
                  </small>
                  <small>
                    <b>Ram :</b> {info?.ram}
                  </small>
                  <small>
                    <b>Rom :</b> {info?.rom}
                  </small>
                  <small>
                    <b>Processor :</b> {info?.processor}
                  </small>
                  <small>
                    <b>Price :</b> {info?.price}
                  </small>
                  <small>
                    <b>Serial NO:</b> {index + 1}
                  </small>
                </div>
              </div>
            ))
          : new Array(item?.quantity)
              ?.fill(item.barcode)
              ?.map((string, index) => (
                <div
                  key={uid()}
                  className="rounded bg-white px-1 pt-2 pb-4 shadow"
                >
                  <Barcode height={60} value={string || 'a'} textAlign="left" />
                  <div className="flex flex-col gap-1 pl-3 leading-3">
                    <small>
                      <b>NO :</b> {index + 1}
                    </small>
                    <small>
                      <b>Product:</b> {item?.product?.name}
                    </small>
                  </div>
                </div>
              ))}
      </div>
    </div>
  );
}
