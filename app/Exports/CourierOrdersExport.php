<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CourierOrdersExport implements FromCollection, ShouldAutoSize, WithProperties, WithStyles, WithHeadings, WithMapping, WithEvents
{
    protected array $data = [];

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function properties(): array
    {
        return [
            'creator' => '414Express',
            'lastModifiedBy' => '414Express',
            'title' => '414Express Sipariş Raporu',
            'description' => '414Express Sipariş Raporu',
            'subject' => 'Sipariş Raporu',
            'keywords' => 'invoices,export,spreadsheet',
            'category' => 'Invoices',
            'manager' => '414Express',
            'company' => '414Express',
        ];
    }

    public function collection(): \Illuminate\Support\Collection
    {
        return collect($this->data);
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function headings(): array
    {
        return [
            "Sipariş No",
            "Kurye Adı",
            "İşletme Adı",
            "İşletme Telefonu",
            "Müşteri Adı",
            "Müşteri Telefonu",
            "Durum",
            "Paket Ücreti",
            "Marketplace",
            "Oluşturulma Tarihi",
            "Güncellenme Tarihi",
        ];
    }

    public function map($row): array
    {
        return [
            $row->orderNumber,
            $row->businessName,
            $row->businessPhone,
            $row->customerName,
            $row->customerPhone,
            $row->courierName,
            $row->status,
            $row->price,
            $row->marketplace,
            $row->createdAt,
            $row->updatedAt,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $lastColumn = $event->sheet->getHighestColumn();
                $lastRow = $event->sheet->getHighestRow();

                $range = 'A1:' . $lastColumn . $lastRow;

                // Border ve padding ayarları
                $event->sheet->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => '#000000'],
                        ],
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        'wrapText' => true, // Metin sarmalı
                        'indent' => 2, // Padding etkisi için indent kullanıyoruz
                    ],
                ]);
            }
        ];
    }

}
