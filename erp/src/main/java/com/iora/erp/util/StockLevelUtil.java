// package com.iora.erp.util;

// import java.util.Map;
// import java.util.function.BinaryOperator;
// import java.util.stream.Collectors;
// import java.util.stream.Stream;

// import com.iora.erp.model.site.StockLevel;

// public class StockLevelUtil {
//     public static BinaryOperator<StockLevel> adder = (first, second) -> {
//         StockLevel out = new StockLevel();

//         out.setQuantities(Stream.of(first.getQuantities(), second.getQuantities())
//                 .flatMap(map -> map.entrySet().stream())
//                 .collect(Collectors.toMap(
//                         Map.Entry::getKey,
//                         Map.Entry::getValue,
//                         (q1, q2) -> q1 + q2)));
//         out.setReservationQty(Stream.of(first.getReservationQty(), second.getReservationQty())
//                 .flatMap(map -> map.entrySet().stream())
//                 .collect(Collectors.toMap(
//                         Map.Entry::getKey,
//                         Map.Entry::getValue,
//                         (q1, q2) -> q1 + q2)));
//         out.setItems(Stream.of(first.getItems(), second.getItems())
//                 .flatMap(map -> map.entrySet().stream())
//                 .collect(Collectors.toMap(
//                         Map.Entry::getKey,
//                         Map.Entry::getValue,
//                         (list1, list2) -> Stream.concat(list1.stream(), list2.stream())
//                                 .collect(Collectors.toList()))));

//         return out;
//     };
// }
