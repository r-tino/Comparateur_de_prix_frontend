import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<T> {
  data: T[]
  columns: {
    accessorKey: keyof T | 'actions'
    header: string
    cell?: (info: { row: { original: T } }) => React.ReactNode
  }[]
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessorKey as string}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={column.accessorKey as string}>
                {column.cell
                  ? column.cell({ row: { original: row } })
                  : column.accessorKey !== 'actions'
                    ? (row[column.accessorKey as keyof T] as React.ReactNode)
                    : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}